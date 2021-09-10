
// this is C# code taken from the old system and needs to be ported to TS
/*
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ibbit.Spatial
{
    public class SpatialHelper
    {
        // Coefficients for UTM Coordinates
        private static double equatorialRadius = 6378137;
        private static double polarRadius = 6356752.3142;
        private static double e = Math.Sqrt(1 - Math.Pow(polarRadius / equatorialRadius, 2)); // flattening
        private static double S = 5103266.421;
        private static double A0 = 6367449.146;
        private static double B0 = 16038.42955;
        private static double C0 = 16.83261333;
        private static double D0 = 0.021984404;
        private static double E0 = 0.000312705;
        private static double sin1 = 4.84814E-06;
        private static double e1sq = e * e / (1 - e * e);
        private static double A6 = -1.00541E-07;

        private double K1 = 5101225.115;
        private double K2 = 3750.291596;
        private double K3 = 1.397608151;
        private double K4 = 214839.3105;
        private double K5 = -2.995382942;
        private double p = -0.483084;
        private double rho = 6368573.744;
        private double nu = 6389236.914;
        private double k0 = 0.9996;

        private char[] posLetters = { 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z' };
        private int[] posDegrees = { 0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 84 };
        private char[] negLetters = { 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M' };
        private int[] negDegrees = { -90, -84, -72, -64, -56, -48, -40, -32, -24, -16, -8 };

        public UTMCoordinate ConvertToUTM(LatLong latlong)
        {
            SetVariables(latlong.Latitude, latlong.Longitude);

            var longZone = GetLongZone(latlong.Longitude);
            //var latZone = GetLatZone(latlong.Latitude);
            var easting = GetEasting();
            var northing = GetNorthing(latlong.Latitude);

            return new UTMCoordinate { Datum = "WGS 84", Easting = easting, Northing = northing, Zone = longZone, Hemisphere = latlong.Latitude >= 0 ? "N" : "S" };
        }

        private string GetLongZone(double longitude)
        {
            double longZone = 0;

            if (longitude < 0.0)
                longZone = ((180.0 + longitude) / 6) + 1;
            else
                longZone = (longitude / 6) + 31;

            var val = ((int)longZone).ToString();

            if (val.Length == 1)
                val = "0" + val;

            return val;
        }

        private double GetNorthing(double latitude)
        {
            double northing = K1 + K2 * p * p + K3 * Math.Pow(p, 4);

            if (latitude < 0.0)
                northing = 10000000 + northing;

            return northing;
        }

        private double GetEasting()
        {
            return 500000 + (K4 * p + K5 * Math.Pow(p, 3));
        }

        private void SetVariables(double latitude, double longitude)
        {
            latitude = DegreeToRadian(latitude);
            rho = equatorialRadius * (1 - e * e)
                / Math.Pow(1 - Math.Pow(e * Math.Sin(latitude), 2), 3 / 2.0);

            nu = equatorialRadius / Math.Pow(1 - Math.Pow(e * Math.Sin(latitude), 2), (1 / 2.0));

            double var1;
            if (longitude < 0.0)
            {
                var1 = ((int)((180 + longitude) / 6.0)) + 1;
            }
            else
            {
                var1 = ((int)(longitude / 6)) + 31;
            }
            double var2 = (6 * var1) - 183;
            double var3 = longitude - var2;
            p = var3 * 3600 / 10000;

            S = A0 * latitude - B0 * Math.Sin(2 * latitude) + C0 * Math.Sin(4 * latitude) - D0
                * Math.Sin(6 * latitude) + E0 * Math.Sin(8 * latitude);

            K1 = S * k0;
            K2 = nu * Math.Sin(latitude) * Math.Cos(latitude) * Math.Pow(sin1, 2) * k0 * (100000000)
                / 2;
            K3 = ((Math.Pow(sin1, 4) * nu * Math.Sin(latitude) * Math.Pow(Math.Cos(latitude), 3)) / 24)
                * (5 - Math.Pow(Math.Tan(latitude), 2) + 9 * e1sq * Math.Pow(Math.Cos(latitude), 2) + 4
                    * Math.Pow(e1sq, 2) * Math.Pow(Math.Cos(latitude), 4))
                * k0
                * (10000000000000000L);

            K4 = nu * Math.Cos(latitude) * sin1 * k0 * 10000;

            K5 = Math.Pow(sin1 * Math.Cos(latitude), 3) * (nu / 6)
                * (1 - Math.Pow(Math.Tan(latitude), 2) + e1sq * Math.Pow(Math.Cos(latitude), 2)) * k0
                * 1000000000000L;

            A6 = (Math.Pow(p * sin1, 6) * nu * Math.Sin(latitude) * Math.Pow(Math.Cos(latitude), 5) / 720)
                * (61 - 58 * Math.Pow(Math.Tan(latitude), 2) + Math.Pow(Math.Tan(latitude), 4) + 270
                    * e1sq * Math.Pow(Math.Cos(latitude), 2) - 330 * e1sq
                    * Math.Pow(Math.Sin(latitude), 2)) * k0 * (1E+24);
        }

        private double DegreeToRadian(double degree)
        {
            return degree * Math.PI / 180;
        }

        private string GetLatZone(double latitude)
        {
            int latIndex = -2;
            int lat = (int)latitude;

            if (lat >= 0)
            {
                int len = posLetters.Length;

                for (int i = 0; i < len; i++)
                {
                    if (lat == posDegrees[i])
                    {
                        latIndex = i;
                        break;
                    }

                    if (lat > posDegrees[i])
                        continue;
                    else
                    {
                        latIndex = i - 1;
                        break;
                    }
                }
            }
            else
            {
                int len = negLetters.Length;

                for (int i = 0; i < len; i++)
                {
                    if (lat == negDegrees[i])
                    {
                        latIndex = i;
                        break;
                    }

                    if (lat < negDegrees[i])
                    {
                        latIndex = i - 1;
                        break;
                    }
                    else
                        continue;
                }
            }

            if (latIndex == -1)
                latIndex = 0;

            if (lat >= 0)
            {
                if (latIndex == -2)
                    latIndex = posLetters.Length - 1;

                return posLetters[latIndex].ToString();
            }
            else
            {
                if (latIndex == -2)
                    latIndex = negLetters.Length - 1;

                return negLetters[latIndex].ToString();
            }
        }
    }

    public class LatLong
    {
        public static LatLong FromStrings(string latitude, string longitude)
        {
            double lat, lon = 0;

            var latWorked = double.TryParse(latitude, out lat);
            var lonWorked = double.TryParse(longitude, out lon);

            if (latWorked && lonWorked)
            {
                return new LatLong
                {
                    Latitude = lat,
                    Longitude = lon
                };
            }

            return null;
        }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string LatitudeAsDMS
        {
            get
            {
                var isNegative = Latitude < 0;
                var angle = Math.Abs(Latitude);
                var degrees = (int)Math.Floor(angle);
                var delta = angle - degrees;
                var secondsT = (int)Math.Floor(3600.0 * delta);
                var seconds = secondsT % 60;
                var minutes = (int)Math.Floor(secondsT / 60.0);
                delta = delta * 3600.0 - secondsT;
                var milliseconds = (int)(Math.Round(delta, 5) * 10000.0);

                return string.Format("{0}° {1:00}' {2:00}.{3:0000}\" {4}", degrees, minutes, seconds, milliseconds, isNegative ? 'S' : 'N');
            }
        }

        public string LongitudeAsDMS
        {
            get
            {
                var isNegative = Longitude < 0;
                var angle = Math.Abs(Longitude);
                var degrees = (int)Math.Floor(angle);
                var delta = angle - degrees;
                var secondsT = (int)Math.Floor(3600.0 * delta);
                var seconds = secondsT % 60;
                var minutes = (int)Math.Floor(secondsT / 60.0);
                delta = delta * 3600.0 - secondsT;
                var milliseconds = (int)(Math.Round(delta, 5) * 10000.0);

                return string.Format("{0}° {1:00}' {2:00}.{3:0000}\" {4}", degrees, minutes, seconds, milliseconds, isNegative ? 'W' : 'E');
            }
        }
    }

    public class UTMCoordinate
    {
        public string Datum { get; set; }
        public string Zone { get; set; }
        public string Hemisphere { get; set; }
        public double Northing { get; set; }
        public double Easting { get; set; }

        public override string ToString()
        {
            return string.Format("{1} {2} {4:N1}E {3:N1}N", Datum, Zone, Hemisphere, Northing, Easting);
        }
    }
}


*/