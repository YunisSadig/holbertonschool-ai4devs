// Sensor helper: moving average over a window of readings (fixed).
import java.util.Arrays;

public class bug6_fixed {
    // For readings [r0..rn-1] and window w, return the average of every
    // consecutive window, i.e. n - w + 1 values. [1,2,3,4], w=2 -> [1.5, 2.5, 3.5].
    static double[] movingAverage(int[] readings, int window) {
        if (window <= 0 || window > readings.length) {
            return new double[0];
        }
        double[] result = new double[readings.length - window + 1];
        for (int i = 0; i <= readings.length - window; i++) {
            int sum = 0;
            for (int j = i; j < i + window; j++) {
                sum += readings[j];
            }
            result[i] = (double) sum / window;
        }
        return result;
    }

    public static void main(String[] args) {
        int[] data = {1, 2, 3, 4};
        System.out.println(Arrays.toString(movingAverage(data, 2))); // [1.5, 2.5, 3.5]
    }
}
