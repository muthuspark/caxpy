package com.caxpy.bi.utility;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;

import org.apache.commons.dbutils.DbUtils;
import org.json.JSONArray;
import org.json.JSONObject;


public class SampleDataLoader {

	 public static void main(String[] args) throws Exception {
		//loadDataForRecommendors();
		loadRealTimeDataForDummyStock();
		// readFromCSV();
		 
//		 JSONArray a = new JSONArray("[   {     otherprovidercontactvalue=7039714603,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=7039714603,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=7039714603,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=5702716389,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=5702716389,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=5702716389,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=3037456264,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=3037456264,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=3037456264,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=patientportal@rmimpc.com,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=patientportal@rmimpc.com,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=patientportal@rmimpc.com,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=c91cff2d-c810-44fc-abea-e4f7475a1157,     fullname=AliShah,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=carfrontdesk@piedmonthealth.org,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Email,     otherprovidercontacttype=PersonalEmail,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=7037384336,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=7037384336,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=7037384336,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0940d923-ede1-406f-8f4e-b8f3740d6ee6,     fullname=AbrahamAlanCherrick,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=5702716021,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=5702716021,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=5702716021,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=e1f60ed0-2bc7-405a-97ac-ec23d2639d56,     fullname=AbrahamJosephLayon,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=9199421473,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=0d25eddf-21f1-469f-840e-7bed4ea2718d,     fullname=AbigailDeVries,     otherprovidercontactmethod=Fax,     otherprovidercontacttype=BusinessFax,     patientproblemid=1b3fc5d2-641f-48af-9d40-7e44e5b3cd8e   },   {     otherprovidercontactvalue=2399361343,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=009c6e96-7a39-4f8a-b6fa-5091f0f285ab,     fullname=AmyWecker,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=2399361343,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=009c6e96-7a39-4f8a-b6fa-5091f0f285ab,     fullname=AmyWecker,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   },   {     otherprovidercontactvalue=2399361343,     patientid=46e1dedc-081c-11e2-9873-eac16188709b,     otherproviderid=009c6e96-7a39-4f8a-b6fa-5091f0f285ab,     fullname=AmyWecker,     otherprovidercontactmethod=Phone,     otherprovidercontacttype=BusinessPhone,     patientproblemid=e9f96545-88ff-4bb3-9206-2ced72a6df55   } ]");
//		 for(int i=0;i<a.length();i++){
//			 JSONObject object = (JSONObject)a.get(i);
//			 System.out.println("Map m"+i+" = new HashMap();");
//			 System.out.println("m"+i+".put(\"otherprovidercontactvalue\",\""+object.get("otherprovidercontactvalue")+"\");");
//			 System.out.println("m"+i+".put(\"patientid\",\""+object.get("patientid")+"\");");
//			 System.out.println("m"+i+".put(\"otherproviderid\",\""+object.get("otherproviderid")+"\");");
//			 System.out.println("m"+i+".put(\"fullname\",\""+object.get("fullname")+"\");");
//			 System.out.println("m"+i+".put(\"otherprovidercontactmethod\",\""+object.get("otherprovidercontactmethod")+"\");");
//			 System.out.println("m"+i+".put(\"otherprovidercontacttype\",\""+object.get("otherprovidercontacttype")+"\");");
//			 System.out.println("m"+i+".put(\"patientproblemid\",\""+object.get("patientproblemid")+"\");");
//			 System.out.println("providerviewlst.add(m"+i+");");
//		 }
	}

	private static void readFromCSV() throws Exception {
		File file = new File("D:\\Delete\\billionaires.csv");
		BufferedReader r = new BufferedReader(new FileReader(file));
		String line = null;
		while((line = r.readLine())!=null){
			//Amazon	88.99	154,100	175.22	US
			if(line.contains(",")){
				String[] split = line.split(",");
				if(split.length != 5){
					//System.err.println(line);
					continue;
				}
				System.out.println("insert into billionaires (name,networth,age,source, country) values"
						+ " ('"+split[0].replaceAll("'", "''")+"',"+split[1]+","+split[2]+",'"+split[3].replaceAll("'", "''")+"','"+split[4].replaceAll("'", "''")+"') ;");	
			}
		}
		r.close();
	}

	private static void loadRealTimeDataForDummyStock() {
		String qry = "insert into dummy (stocksymbol, stockvalue, stockname) values ('CAX',?,'Caxpy Inc.')";
		final String url = "jdbc:mysql://localhost:3306/stocks";
		Connection tempconnection = null;
		final String driver = "com.mysql.jdbc.Driver";
		try {
			DbUtils.loadDriver(driver);
			tempconnection = DriverManager.getConnection(url, "root","password");
			PreparedStatement stat = tempconnection.prepareStatement(qry);
			for(int i=0;i<100;i++){
				int nextInt = new Random().nextInt(300);
				stat.setInt(1, nextInt);
				stat.executeUpdate();
				Thread.sleep(2000);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(tempconnection!=null){
					tempconnection.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			} 
		}
	}

	private static void loadDataForRecommendors() {
		String qry = "select  aps.product_id,  aps.customer_id , c.fullname,p.product_name  from agg_pl_01_sales_fact_1997 as aps , product p, customer c where aps.product_id=p.product_id and c.customer_id = aps.customer_id";
		final String url = "jdbc:mysql://localhost:3306/foodmart";
		Connection tempconnection = null;
		final String driver = "com.mysql.jdbc.Driver";
		BufferedWriter writer = null;
		try {
			DbUtils.loadDriver(driver);
			tempconnection = DriverManager.getConnection(url, "root","password");
			Statement stat = tempconnection.createStatement();
			ResultSet rs = stat
					.executeQuery(qry);
			writer = new BufferedWriter(new FileWriter(new File("D:/Delete/rec1.csv")));
			while (rs.next()) {
				writer.write(rs.getInt(2)+","+rs.getInt(1));
				writer.newLine();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				writer.close();
				if(tempconnection!=null){
					tempconnection.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
