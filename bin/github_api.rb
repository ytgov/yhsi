require "net/http"
require "json"
require "uri"

##
# Supports building a branch name from a Github issue URL
# If issue is from the same repo as the project, the branch name will be in the format:
#   issue-<issue_number>/<issue_title>
# If issue is from a replated repo (presumably the upstream one), the branch name will be in the format:
#   <issue_owner>-issue-<issue_number>/<issue_title>
class GithubApi
  GITHUB_TOKEN = ENV["GITHUB_TOKEN"]
  GITHUB_REPO = "icefoganalytics/yhsi" # Format: 'owner/repo'
  GITHUB_API_BASE = "https://api.github.com"

  def self.build_branch_name(github_issue_url)
    if GITHUB_TOKEN.nil?
      puts "Please set GITHUB_TOKEN environment variable"
      return
    end

    issue_repo = extract_issue_repo(github_issue_url)
    issue_number = extract_issue_number(github_issue_url)
    issue_title = fetch_issue_title(issue_repo, issue_number)
    format_branch_name(issue_repo, issue_number, issue_title)
  end

  # Fetches the body of a GitHub issue using GitHub CLI
  def self.fetch_issue_body(github_issue_url)
    issue_repo = extract_issue_repo(github_issue_url)
    issue_number = extract_issue_number(github_issue_url)

    command = "gh issue view #{issue_number} --repo #{issue_repo} --json body --jq .body"
    puts "running: #{command}"
    stdout, stderr, status = Open3.capture3(command)

    if status.success?
      stdout.strip
    else
      puts "Error fetching issue body: #{stderr}"
      exit(1)
    end
  end

  private

  def self.extract_issue_repo(url)
    match_data = url.match(%r{github.com/([^/]+)/([^/]+)/issues/\d+})
    "#{match_data[1]}/#{match_data[2]}"
  end

  def self.extract_issue_number(url)
    url.match(%r{/issues/(\d+)})[1]
  end

  def self.fetch_issue_title(repo, issue_number)
    uri = URI("#{GITHUB_API_BASE}/repos/#{repo}/issues/#{issue_number}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "token #{GITHUB_TOKEN}"

    response =
      Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }

    data = JSON.parse(response.body)
    data["title"]
  end

  def self.format_branch_name(issue_repo, issue_number, issue_title)
    formatted_title =
      issue_title.downcase.strip.gsub(/\s+/, "-").gsub(/[^a-z0-9\-]/, "").gsub(/-+/, "-")

    return "issue-#{issue_number}/#{formatted_title}" if issue_repo == GITHUB_REPO

    issue_owner = issue_repo.split("/")[0]
    "#{issue_owner}-issue-#{issue_number}/#{formatted_title}"
  end
end
