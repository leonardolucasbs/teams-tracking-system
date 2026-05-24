package leonardolucasbs.backend.common.geo;

import org.springframework.stereotype.Component;

@Component
public class HaversineCalculator {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public double calculateDistanceInKm(
            double startLatitude,
            double startLongitude,
            double endLatitude,
            double endLongitude
    ) {
        double latitudeDistance = Math.toRadians(endLatitude - startLatitude);
        double longitudeDistance = Math.toRadians(endLongitude - startLongitude);
        double startLatitudeRadians = Math.toRadians(startLatitude);
        double endLatitudeRadians = Math.toRadians(endLatitude);

        double haversine = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(startLatitudeRadians)
                * Math.cos(endLatitudeRadians)
                * Math.sin(longitudeDistance / 2)
                * Math.sin(longitudeDistance / 2);

        double centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return EARTH_RADIUS_KM * centralAngle;
    }
}
