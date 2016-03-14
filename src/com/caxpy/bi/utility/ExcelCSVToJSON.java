package com.caxpy.bi.utility;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Iterator;

import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.opencsv.CSVReader;

public class ExcelCSVToJSON {

	public static void main(String[] args) throws IOException, JSONException {
		File file = new File("D:\\Delete\\billionaires.csv");
		convertToJson(file);
	}

	public static String convertToJson(File file) throws IOException,
			JSONException {
		String response = "";
		String extension = FilenameUtils.getExtension(file.getAbsolutePath());
		if (extension.equalsIgnoreCase("csv")) {
			response = handleCSV(file);
		} else if (extension.equalsIgnoreCase("xls")) {
			response = handleXLS(file);
		} else if (extension.equalsIgnoreCase("xlsx")) {
			response = handleXLSX(file);
		}
		return response;
	}

	private static String handleXLSX(File xlsxfile) throws IOException, JSONException {
		FileInputStream file = new FileInputStream(xlsxfile);
		// Get the workbook instance for XLS file
		XSSFWorkbook workbook = new XSSFWorkbook(file);
		JSONArray jsonresult = new JSONArray();
		try {
			
			// Get first sheet from the workbook
			XSSFSheet sheet = workbook.getSheetAt(0);
			// Get iterator to all the rows in current sheet
			Iterator<Row> rowIterator = sheet.iterator();
			int rowindex = 0;
			String[] firstrow = null;
			int cellsize = 0;
			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				// For each row, iterate through each columns
				Iterator<Cell> cellIterator = row.cellIterator();
				if (rowindex == 0) {
					int cellindex = 0;
					cellsize = row.getPhysicalNumberOfCells();
					firstrow = new String[cellsize];
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						firstrow[cellindex] = cell.toString();
						cellindex++;
					}
				}else{
					JSONObject obj = new JSONObject();
					int cellindex = 0;
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						if(cellindex < cellsize){
							obj.put(firstrow[cellindex], cell.toString());
							cellindex++;
						}
					}
					jsonresult.put(obj);
				}
				rowindex++;
			}
		} finally {
			file.close();
			workbook.close();
		}
		return jsonresult.toString();
	}

	private static String handleXLS(File xlsfile) throws IOException, JSONException {
		FileInputStream file = new FileInputStream(xlsfile);
		// Get the workbook instance for XLS file
		HSSFWorkbook workbook = new HSSFWorkbook(file);
		JSONArray jsonresult = new JSONArray();
		try {
			
			// Get first sheet from the workbook
			HSSFSheet sheet = workbook.getSheetAt(0);
			// Get iterator to all the rows in current sheet
			Iterator<Row> rowIterator = sheet.iterator();
			int rowindex = 0;
			String[] firstrow = null;
			int cellsize = 0;
			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				// For each row, iterate through each columns
				Iterator<Cell> cellIterator = row.cellIterator();
				if (rowindex == 0) {
					int cellindex = 0;
					cellsize = row.getPhysicalNumberOfCells();
					firstrow = new String[cellsize];
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						firstrow[cellindex] = cell.toString();
						cellindex++;
					}
				}else{
					JSONObject obj = new JSONObject();
					int cellindex = 0;
					while (cellIterator.hasNext()) {
						Cell cell = cellIterator.next();
						if(cellindex < cellsize){
							obj.put(firstrow[cellindex], cell.toString());
							cellindex++;
						}
					}
					jsonresult.put(obj);
				}
				rowindex++;
			}
		} finally {
			file.close();
			workbook.close();
		}
		return jsonresult.toString();
	}

	private static String handleCSV(File file) throws IOException,
			JSONException {
		JSONArray jsonresult = new JSONArray();
		CSVReader reader = new CSVReader(new FileReader(file));
		int row = 0;
		String[] nextLine = null;
		String[] firstrow = null;
		try {
			while ((nextLine = reader.readNext()) != null) {
				if (row == 0) {
					firstrow = nextLine;// catch the first row and continue
					row++;
					continue;
				}
				JSONObject obj = new JSONObject();
				for (int t = 0; t < firstrow.length; t++) {
					obj.put(firstrow[t], nextLine[t]);
				}
				jsonresult.put(obj);
				row++;
			}
		} finally {
			if (reader != null) {
				reader.close();
			}
		}
		return jsonresult.toString();
	}
}
