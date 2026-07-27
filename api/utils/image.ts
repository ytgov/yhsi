
import sharp from "sharp";

const THUMBNAIL_JPEG_QUALITY = 100;
const THUMBNAIL_WIDTH = 672;
const THUMBNAIL_HEIGHT = 448;

export async function createThumbnail(input: Buffer): Promise<Buffer> {
    return sharp(input)
        .rotate() // auto-orient from EXIF before resizing, otherwise rotation is lost
        .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
        .jpeg({ quality: THUMBNAIL_JPEG_QUALITY })
        .toBuffer();
}
