import java.util.Scanner;
class Parent{
    String parent_name="Abishek";
}
class Childs extends Parent{
    String child_1="Bala";
    String child_2="Shiji";
}
class Hello{
    public static void main(String[] args) {
        Scanner a = new Scanner(System.in);
        Childs ch = new Childs();
        System.out.println(ch.parent_name);
        System.out.println(ch.child_1);
        System.out.println(ch.child_2);
        
    }
    
}