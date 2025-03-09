package HG_DeveloperUtilities.HG_ConfigurationManager.v1;

// -----( IS Java Code Template v1.2

import com.wm.data.*;
import com.wm.util.Values;
import com.wm.app.b2b.server.Service;
import com.wm.app.b2b.server.ServiceException;
// --- <<IS-START-IMPORTS>> ---
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.wm.data.IData;
import com.wm.data.IDataCursor;
import com.wm.data.IDataFactory;
import com.wm.data.IDataUtil;
import java.io.*;
import java.nio.file.*;
// --- <<IS-END-IMPORTS>> ---

public final class subservices

{
	// ---( internal utility methods )---

	final static subservices _instance = new subservices();

	static subservices _newInstance() { return new subservices(); }

	static subservices _cast(Object o) { return (subservices)o; }

	// ---( server methods )---




	public static final void createDirectory (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(createDirectory)>> ---
		// @sigtype java 3.5
		// [i] field:0:required path
		// [i] field:0:required newFolderName
		// [o] object:0:required success
		// [o] field:0:required error
		
		// pipeline
		IDataCursor pipelineCursor = pipeline.getCursor();
			String	path = IDataUtil.getString( pipelineCursor, "path" );
			String	newFolderName = IDataUtil.getString( pipelineCursor, "newFolderName" );
		pipelineCursor.destroy();
		
		
		// Output variables
		boolean success = false;
		String error = null;
		
		
		 // Validate input
		if (path == null || newFolderName == null || path.isEmpty() || newFolderName.isEmpty()) {
		    error = "Path or folder name cannot be empty.";
		} else {
		    try {
		        // Create the new directory
		        File newDir = new File(path, newFolderName);
		        if (!newDir.exists()) {
		            success = newDir.mkdirs(); // Create directories (including parent if needed)
		            if (!success) {
		                error = "Failed to create directory. Check permissions.";
		            }
		        } else {
		            error = "Directory already exists.";
		        }
		    } catch (Exception e) {
		        error = "Error creating directory: " + e.getMessage();
		    }
		}
		
		// Set output values in pipeline
		IDataCursor outputCursor = pipeline.getCursor();
		IDataUtil.put(outputCursor, "success", success);
		IDataUtil.put(outputCursor, "error", error);
		outputCursor.destroy();
		// --- <<IS-END>> ---

                
	}



	public static final void editFile (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(editFile)>> ---
		// @sigtype java 3.5
		// [i] object:0:required createBackup
		// [i] field:0:required filePath
		// [i] field:0:required fileContent
		// [o] field:0:required successFlag
		// [o] field:0:required successMessage
		// pipeline
		
		IDataCursor cursor = pipeline.getCursor();
		boolean successFlag = false;
		String successMessage = "";
		
		try {
		    // Retrieve input parameters
		    Object createBackupObj = IDataUtil.get(cursor, "createBackup");
		    String filePath = IDataUtil.getString(cursor, "filePath");
		    String fileContent = IDataUtil.getString(cursor, "fileContent");
		
		    // Validate inputs
		    if (createBackupObj == null || filePath == null || fileContent == null ||
		        filePath.isEmpty() || fileContent.isEmpty()) {
		        throw new ServiceException("All parameters (createBackup, filePath, fileContent) are required.");
		    }
		
		    // Convert createBackup to boolean
		    boolean createBackup = Boolean.parseBoolean(createBackupObj.toString());
		
		    File originalFile = new File(filePath);
		    if (!originalFile.exists() || !originalFile.isFile()) {
		        throw new ServiceException("Invalid file path: " + filePath);
		    }
		
		    // Create a backup if required
		    if (createBackup) {
		        File backupFile = new File(filePath + ".bkp");
		        Files.copy(originalFile.toPath(), backupFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
		    }
		
		    // Replace original file content
		    try (BufferedWriter writer = new BufferedWriter(new FileWriter(originalFile))) {
		        writer.write(fileContent);
		    }
		
		    // Set success response
		    successFlag = true;
		    successMessage = "File updated successfully" + (createBackup ? " with backup created." : ".");
		
		} catch (IOException e) {
		    successMessage = "Error processing file: " + e.getMessage();
		    throw new ServiceException(successMessage);
		} finally {
		    // Return successFlag and successMessage
		    IDataUtil.put(cursor, "successFlag", successFlag);
		    IDataUtil.put(cursor, "successMessage", successMessage);
		    cursor.destroy();
		}
			
		// --- <<IS-END>> ---

                
	}



	public static final void getFileStructure (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(getFileStructure)>> ---
		// @sigtype java 3.5
		// [i] field:0:required rootPath
		IDataCursor cursor = pipeline.getCursor();
		String rootPath = null;
		
		if (cursor.first("rootPath")) {
		    rootPath = (String) cursor.getValue();
		}
		cursor.destroy();
		
		// Validate rootPath
		if (rootPath == null || rootPath.isEmpty()) {
		    throw new ServiceException("Error: Root path is required.");
		}
		
		try {
		    rootPath = rootPath.replace("\\", File.separator).replace("/", File.separator);
		    File rootDir = new File(rootPath);
		
		    if (!rootDir.exists()) {
		        throw new ServiceException("Error: Directory does not exist - " + rootPath);
		    }
		    if (!rootDir.isDirectory()) {
		        throw new ServiceException("Error: Provided path is not a directory - " + rootPath);
		    }
		
		    // Create root node
		    IData rootData = IDataFactory.create();
		    IDataCursor rootCursor = rootData.getCursor();
		    IDataUtil.put(rootCursor, "name", rootDir.getName());
		    IDataUtil.put(rootCursor, "path", rootDir.getAbsolutePath());
		    IDataUtil.put(rootCursor, "isDirectory", true);
		
		    // Get children and attach to root
		    List<IData> fileStructure = getFileTree(rootDir);
		    IDataUtil.put(rootCursor, "children", fileStructure.toArray(new IData[0]));
		    rootCursor.destroy();
		
		    // Prepare output
		    IData output = IDataFactory.create();
		    IDataCursor outputCursor = output.getCursor();
		    IDataUtil.put(outputCursor, "fileStructure", rootData);
		    outputCursor.destroy();
		
		    IDataUtil.merge(output, pipeline);
		
		} catch (Exception e) {
		    throw new ServiceException("Error: " + e.getMessage());
		}
			
		// --- <<IS-END>> ---

                
	}



	public static final void readFile (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(readFile)>> ---
		// @sigtype java 3.5
		// [i] field:0:required filePath
		IDataCursor cursor = pipeline.getCursor();
		
		try {
		    // Get file path from pipeline
		    String filePath = null;
		    if (cursor.first("filePath")) {
		        filePath = (String) cursor.getValue();
		    }
		    
		    if (filePath == null || filePath.isEmpty()) {
		        throw new ServiceException("File path is missing");
		    }
		    
		    // Read file content
		    String content = new String(Files.readAllBytes(Paths.get(filePath)), "UTF-8");
		    
		    // Put content into pipeline
		    IDataUtil.put(cursor, "fileContent", content);
		} catch (IOException e) {
		    throw new ServiceException("Error reading file: " + e.getMessage());
		} finally {
		    cursor.destroy();
		}
		
		
			
		// --- <<IS-END>> ---

                
	}



	public static final void writeFile (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(writeFile)>> ---
		// @sigtype java 3.5
		// [i] field:0:required fileName
		// [i] object:0:required fileContent
		// [i] field:0:required filePath
		// [o] object:0:required success
		// [o] field:0:required error
		
		IDataCursor cursor = pipeline.getCursor();
		
		String fileName = null;
		byte[] fileContent = null;
		String filePath = null;
		
		boolean success = false;
		String error = "";
		
		try {
		    if (cursor.first("fileName")) {
		        fileName = (String) cursor.getValue();
		    }
		    if (cursor.first("fileContent")) {
		        fileContent = (byte[]) cursor.getValue();
		    }
		    if (cursor.first("filePath")) {
		        filePath = (String) cursor.getValue();
		    }
		    
		    if (fileName == null || fileContent == null || filePath == null) {
		        throw new Exception("Missing required inputs");
		    }
		    
		    File directory = new File(filePath);
		    if (!directory.exists()) {
		        directory.mkdirs(); // Create the directory if it doesn't exist
		    }
		    
		    File file = new File(filePath + File.separator + fileName);
		    try (FileOutputStream fos = new FileOutputStream(file)) {
		        fos.write(fileContent);
		        fos.flush();
		        success = true;
		    }
		} catch (Exception e) {
		    success = false;
		    error = e.getMessage();
		} finally {
		    cursor.destroy();
		}
		
		// Output
		IDataCursor outputCursor = pipeline.getCursor();
		outputCursor.insertAfter("success", success);
		outputCursor.insertAfter("error", error);
		outputCursor.destroy();
		  
		// --- <<IS-END>> ---

                
	}

	// --- <<IS-START-SHARED>> ---
	
	private static List<IData> getFileTree(File directory) {
	    List<IData> fileList = new ArrayList<>();
	    File[] files = directory.listFiles();
	
	    if (files != null) {
	        for (File file : files) {
	            IData fileData = IDataFactory.create();
	            IDataCursor fileCursor = fileData.getCursor();
	            IDataUtil.put(fileCursor, "name", file.getName());
	            IDataUtil.put(fileCursor, "path", file.getAbsolutePath());
	            IDataUtil.put(fileCursor, "isDirectory", file.isDirectory());
	
	            if (file.isDirectory()) {
	                IDataUtil.put(fileCursor, "children", getFileTree(file).toArray(new IData[0]));
	            }
	
	            fileCursor.destroy();
	            fileList.add(fileData);
	        }
	    }
	    return fileList;
	}
	// --- <<IS-END-SHARED>> ---
}

