const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const targetDirectory = "./result"; // Target directory to move files

// Ensure target directory exists
if (!fs.existsSync(targetDirectory)) {
  fs.mkdirSync(targetDirectory, { recursive: true });
}

// Controller for handling file upload and processing
const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const parsedData = []; // Array to store parsed rows
    // Read and parse the CSV file
    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          let sl_count = 1;

          // Extract required fields
          const serial_no = row["SR_NO"];
          const name = row["NAME"];
          const fatherName = row["FATHER_NAME"];
          const class_code = row["CLASS_CODE"];
          const section = row["SECTION"];
          const school = row["SCHOOL"];
          const tehsil = row["TEHSIL"];
          const district = row["CITY_NAME"];
          const state = row["STATE_NAME"];
          const year = row["YEAR"];
          const totalMarks = parseInt(row["TOTAL_MARKS"]);

          const fiftyMarks = totalMarks <= 50 ? "*" : "";
          const fiftyToEightyMarks =
            totalMarks >= 51 && totalMarks <= 80 ? "*" : "";
          const moreThanEightyMarks = totalMarks >= 81 ? "*" : "";

          // Push the parsed row into the array
          const school_code = row["SCHOOL_CODE"];
          parsedData.push({
            SL_N0: 0,
            ROLL_NO: serial_no,
            NAME: name,
            FATHER_NAME: fatherName,
            CLASS: class_code,
            SECTION: section,
            SCHOOL: school,
            TEHSIL: tehsil,
            "50 OR LESS": fiftyMarks,
            "51-80": fiftyToEightyMarks,
            "81+": moreThanEightyMarks,
            DISTRICT: district,
            STATE: state,
            YEAR: year,
            HEADER: school_code,
            TOTAL_MARKS: totalMarks,
            SCHOOL_CODE: school_code,
            // Add this field for sorting
          });
        } catch (error) {
          console.error(`Error processing row ${row}: ${error.message}`);
        }
      })
      .on("end", () => {
        // Sort the data based on multiple fields
        parsedData.sort((a, b) => {
          if (a.TEHSIL !== b.TEHSIL) {
            return a.TEHSIL.localeCompare(b.TEHSIL); // Sort by TEHSIL
          }
          if (a.HEADER !== b.HEADER) {
            return a.HEADER.localeCompare(b.HEADER); // Sort by SCHOOL_CODE
          }
          if (a.CLASS !== b.CLASS) {
            return a.CLASS.localeCompare(b.CLASS); // Sort by CLASS_CODE
          }
          if (a.TOTAL_MARKS !== b.TOTAL_MARKS) {
            return b.TOTAL_MARKS - a.TOTAL_MARKS; // Sort by TOTAL_MARKS (High to Low)
          }
          return a.ROLL_NO - b.ROLL_NO; // Sort by SR_NO (Low to High)
        });

        // Initialize a variable to keep track of the previous HEADER value
        let prevHeader = null;
        let count = 1;

        parsedData.forEach((item) => {
          // Reset count when a new HEADER (SCHOOL_CODE) is encountered
          if (item.SCHOOL_CODE !== prevHeader) {
            count = 1; // Reset count for a new header group
          }

          // Assign SL_NO and HEADER
          item.SL_N0 = count;
          item.HEADER = `${item.HEADER}/${count}`;

          // Increment count for the next item in the group
          count++;

          // Update previous HEADER for the next comparison
          prevHeader = item.SCHOOL_CODE;
        });
        // Generate CSV file
        try {
          const csvFilePath = path.join(targetDirectory, "processed_data.csv");
          const headers =
            Object.keys(parsedData[0])
              .filter((key) => key !== "TOTAL_MARKS") // Remove TOTAL_MARKS from headers
              .join(",") + "\n"; // Generate CSV headers

          const rows = parsedData
            .map((row) =>
              Object.values(row)
                .filter((value, index) => index !== 13) // Remove TOTAL_MARKS value from rows
                .map((value) => `"${value}"`) // Quote each value to handle special characters
                .join(",")
            )
            .join("\n"); // Generate CSV rows

          const csvContent = headers + rows; // Combine headers and rows
          fs.writeFileSync(csvFilePath, csvContent); // Write CSV file

          res.status(200).json({
            message: "File processed successfully and CSV created",
            csvFilePath,
          });
        } catch (csvError) {
          res.status(500).json({
            message: "Error creating CSV file",
            error: csvError.message,
          });
        }
      })
      .on("error", (error) => {
        res.status(500).json({
          message: "Error processing file",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
};

module.exports = { uploadFile };
