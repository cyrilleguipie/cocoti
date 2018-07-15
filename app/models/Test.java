package models;

import java.util.*;
import java.io.*;
import java.math.*;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Test {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        if (in.hasNextLine()) {
            in.nextLine();
        }
        HashMap<String,Integer> map = new HashMap<>();
        String names = in.nextLine();
        String[] tab = names.split(" ");
        for(String name:tab){
            if(map.containsKey(name)){
                map.put(name,map.get(name)+1);
            }else{
                map.put(name,1);
            }
            System.err.println(name);
        }
        System.out.println("conspiracy");
    }
}