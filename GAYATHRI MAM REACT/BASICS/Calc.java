class parent{
    int n1,n2;
    parent(int n1,int n2){
        this.n1=n1;
        this.n2=n2;
    }
    void fun(){
        System.out.println(n1+n2);
    }
}
class child extends parent{
    int n3;
    child(int n1,int n2,int n3){
        super(n1,n2);
        this.n3=n3;
    }
    void add(){
        System.out.println(n1+n2+n3);
    }
}
public class Calc {
    public static void main(String[] args) {
        child ch = new child(1,2,3);
        ch.add();
        ch.fun();  
    }
    
}
