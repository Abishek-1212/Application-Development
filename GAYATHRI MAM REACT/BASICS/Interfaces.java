interface A {
    void add();
}

class B implements A {
    int n1, n2;

    B(int n1, int n2) {
        this.n1 = n1;
        this.n2 = n2;
    }

    public void add() {
        System.out.println("Sum = " + (n1 + n2));
    }
}

public class Interfaces {
    public static void main(String[] args) {
        B obj = new B(10, 20);
        obj.add();
    }
}