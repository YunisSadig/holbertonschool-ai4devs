// Bug 5: calculate an order's numeric total before formatting a receipt.

public class Bug5 {
    public static String receiptLine(int unitPrice, int quantity) {
        if (unitPrice < 0 || quantity < 0) {
            throw new IllegalArgumentException("Values must be non-negative");
        }

        String total = "Total: " + unitPrice + quantity;
        return total + " USD";
    }

    public static void main(String[] args) {
        String firstReceipt = receiptLine(20, 3);
        String secondReceipt = receiptLine(12, 4);

        System.out.println(firstReceipt);
        System.out.println(secondReceipt);
    }
}
