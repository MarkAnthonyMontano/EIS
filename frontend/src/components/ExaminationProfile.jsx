import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import EaristLogo from "../assets/EaristLogo.png";
import '../styles/Print.css'

const ExaminationProfile = () => {


    const getPersonIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            return decoded.person_id; // Make sure your token contains this field
        }
        return null;
    };

    const [data, setData] = useState([]);
    const personIDFromToken = getPersonIdFromToken();

    const [profilePicture, setProfilePicture] = useState(null);
    const [personID, setPersonID] = useState('');



    const [studentNumber, setStudentNumber] = useState("");

    const fetchProfilePicture = async (person_id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user/${person_id}`);
            if (res.data && res.data.profile_img) {
                console.log(res.data.profile_img);
                setProfilePicture(`http://localhost:5000/uploads/${res.data.profile_img}`);
            }
        } catch (error) {
            console.error("Error fetching profile picture:", error);
            setProfilePicture(null);
        }
    };

    useEffect(() => {
        if (personID) {
            fetchProfilePicture(personID);
        }
    }, [personID]);

    useEffect(() => {
        if (personID) {
            console.log("Fetched Data:", data); // SEE what's actually returned
        }
    }, [data]);



    const [shortDate, setShortDate] = useState("");
    const [longDate, setLongDate] = useState("");

    useEffect(() => {
        const updateDates = () => {
            const now = new Date();

            // Format 1: MM/DD/YYYY
            const formattedShort = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
            setShortDate(formattedShort);

            // Format 2: MM DD, YYYY hh:mm:ss AM/PM
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear();
            const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const ampm = now.getHours() >= 12 ? "PM" : "AM";

            const formattedLong = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
            setLongDate(formattedLong);
        };

        updateDates(); // Set initial values
        const interval = setInterval(updateDates, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const [courses, setCourses] = useState([]);
    const [enrolled, setEnrolled] = useState([]);

    const [userId, setUserId] = useState(null); // Dynamic userId
    const [first_name, setUserFirstName] = useState(null); // Dynamic userId
    const [middle_name, setUserMiddleName] = useState(null); // Dynamic userId

    const [last_name, setUserLastName] = useState(null); // Dynamic userId
    const [currId, setCurr] = useState(null); // Dynamic userId
    const [courseCode, setCourseCode] = useState("");
    const [courseDescription, setCourseDescription] = useState("");

    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [subjectCounts, setSubjectCounts] = useState({});
    const [year_Level_Description, setYearLevelDescription] = useState(null);
    const [major, setMajor] = useState(null);

    useEffect(() => {
        if (selectedSection) {
            fetchSubjectCounts(selectedSection);
        }
    }, [selectedSection]);

    const fetchSubjectCounts = async (sectionId) => {
        try {
            const response = await axios.get("http://localhost:5000/subject-enrollment-count", {
                params: { sectionId },
            });

            // Transform into object for easy lookup: { subject_id: enrolled_count }
            const counts = {};
            response.data.forEach((item) => {
                counts[item.subject_id] = item.enrolled_count;
            });

            setSubjectCounts(counts);
        } catch (err) {
            console.error("Failed to fetch subject counts", err);
        }
    };

    useEffect(() => {
        if (currId) {
            axios
                .get(`http://localhost:5000/courses/${currId}`)
                .then((res) => setCourses(res.data))
                .catch((err) => console.error(err));
        }
    }, [currId]);

    useEffect(() => {
        if (userId && currId) {
            axios
                .get(`http://localhost:5000/enrolled_courses/${userId}/${currId}`)
                .then((res) => setEnrolled(res.data))
                .catch((err) => console.error(err));
        }
    }, [userId, currId]);

    // Fetch department sections when component mounts
    useEffect(() => {
        fetchDepartmentSections();
    }, []);

    // Fetch sections whenever selectedDepartment changes
    useEffect(() => {
        if (selectedDepartment) {
            fetchDepartmentSections();
        }
    }, [selectedDepartment]);

    // Fetch department sections based on selected department
    const fetchDepartmentSections = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/department-sections", {
                params: { departmentId: selectedDepartment },
            });
            // Artificial delay
            setTimeout(() => {
                setSections(response.data);
                setLoading(false);
            }, 700); // 3 seconds delay
        } catch (err) {
            console.error("Error fetching department sections:", err);
            setError("Failed to load department sections");
            setLoading(false);
        }
    };

    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null);
    const [email, setEmail] = useState(null);
    const [program, setProgram] = useState(null);
    const [course_unit, setCourseUnit] = useState(null);
    const [lab_unit, setLabUnit] = useState(null);
    const [year_desc, setYearDescription] = useState(null);

    const handleSearchStudent = async () => {
        if (!studentNumber.trim()) {
            alert("Please fill in the student number");
            return;
        }

        try {
            // 1. Authenticate and tag student
            const response = await axios.post("http://localhost:5000/student-tagging", { studentNumber }, {
                headers: { "Content-Type": "application/json" }
            });

            // Destructure from response
            const {
                token,
                person_id,
                studentNumber: studentNum,
                activeCurriculum: active_curriculum,
                major: major,
                yearLevel,
                yearLevelDescription: yearLevelDescription,
                yearDesc: yearDesc,
                courseCode: course_code,
                courseDescription: course_desc,
                departmentName: dprtmnt_name,
                courseUnit: course_unit,
                labUnit: lab_unit,
                firstName: first_name,
                middleName: middle_name,
                lastName: last_name
            } = response.data;

            console.log("data[0]:", data[0]);
            console.log(course_unit);
            // Save to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("person_id", person_id);
            localStorage.setItem("studentNumber", studentNum);
            localStorage.setItem("activeCurriculum", active_curriculum);
            localStorage.setItem("major", major);
            localStorage.setItem("yearLevel", yearLevel);
            localStorage.setItem("departmentName", dprtmnt_name);
            localStorage.setItem("courseCode", course_code);
            localStorage.setItem("courseDescription", course_desc);
            localStorage.setItem("courseUnit", course_unit);
            localStorage.setItem("labUnit", lab_unit);
            localStorage.setItem("firstName", first_name);
            localStorage.setItem("middleName", middle_name);
            localStorage.setItem("lastName", last_name);
            localStorage.setItem("yearLevelDescription", yearLevelDescription);
            localStorage.setItem("yearDesc", yearDesc);
            // Update state variables
            setUserId(studentNum);
            setUserFirstName(first_name);
            setUserMiddleName(middle_name);
            setUserLastName(last_name);
            setCurr(active_curriculum);
            setMajor(major);
            setCourseCode(dprtmnt_name);
            setCourseCode(course_code);
            setCourseDescription(course_desc);
            setCourseUnit(course_unit);
            setLabUnit(lab_unit);
            setPersonID(person_id);
            setYearLevelDescription(yearLevelDescription);
            setYearDescription(yearDesc);

            console.log(yearLevelDescription);
            // 2. Fetch full student data (COR info)
            const corResponse = await axios.get(`http://localhost:5000/student-data/${studentNum}`);
            const fullData = corResponse.data;
            // Store complete data for rendering
            setData([fullData]); // Wrap in array for data[0] compatibility

            // 3. Set additional fields: gender, age, email, program
            setGender(fullData.gender || null);
            setAge(fullData.age || null);
            console.log(age)
            console.log(major)
            console.log("person.program:", data[0]?.program);
            setEmail(fullData.email || null);
            setProgram(active_curriculum);

            alert("Student found and data loaded!");

        } catch (error) {
            console.error("Student search failed:", error);
            alert(error.response?.data?.message || "Student not found");
        }
    };




    // Fetch all departments when component mounts
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get("http://localhost:5000/departments");
                setDepartments(res.data);
            } catch (err) {
                console.error("Error fetching departments:", err);
            }
        };

        fetchDepartments();
    }, []);


    const divToPrintRef = useRef();

    const printDiv = () => {
        const divToPrint = divToPrintRef.current;
        if (divToPrint) {
            const newWin = window.open('', 'Print-Window');
            newWin.document.open();
            newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
            
              font-family: Arial, sans-serif;
              overflow: hidden;
            }

            .print-container {
              width: 110%;
              height: 100%;

              box-sizing: border-box;
   
              transform: scale(0.90);
              transform-origin: top left;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            button {
              display: none;
            }

            .student-table {
              margin-top: 5px !important;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 100);">
          <div class="print-container">
            ${divToPrint.innerHTML}
          </div>
        </body>
      </html>
    `);
            newWin.document.close();
        } else {
            console.error("divToPrintRef is not set.");
        }
    };

    const totalCourseUnits = enrolled.reduce((sum, item) => sum + (parseFloat(item.course_unit) || 0), 0);
    const totalLabUnits = enrolled.reduce((sum, item) => sum + (parseFloat(item.lab_unit) || 0), 0);
    const totalCombined = totalCourseUnits + totalLabUnits;


    const [curriculumOptions, setCurriculumOptions] = useState([]);

    useEffect(() => {
        const fetchCurriculums = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/applied_program");
                setCurriculumOptions(response.data);
            } catch (error) {
                console.error("Error fetching curriculum options:", error);
            }
        };

        fetchCurriculums();
    }, []);


    console.log("person.program:", data.program);
    console.log("curriculumOptions:", curriculumOptions);

    {
        curriculumOptions.find(
            (item) =>
                item?.curriculum_id?.toString() === (data?.program ?? "").toString()
        )?.program_description || (data?.program ?? "")

    }


    const getCollegeByProgram = (programName) => {
        for (const [college, program_description] of Object.entries(collegeProgramMap)) {
            if (program_description.includes(programName)) {
                return college;
            }
        }
        return "";
    };

    // Put this mapping outside your component
    const collegeProgramMap = {
        "College of Architecture and Fine Arts": [
            "Bachelor of Science in Architecture",
            "Bachelor of Science in Interior Design",
            "Bachelor in Fine Arts Major in Painting",
            "Bachelor in Fine Arts Major in Visual Communication",
            "Bachelor of Science Major in Fine Arts",
            "Bachelor of Science in Fine Arts Major in External Design"
        ],
        "College of Arts and Sciences": [
            "Bachelor of Science in Applied Physics with Computer Science Emphasis",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Mathematics"
        ],
        "College of Business and Public Administration": [
            "Bachelor of Science in Business Administration Major in Marketing Management",
            "Bachelor of Science in Business Administration Major in HR Development Management",
            "Bachelor of Science in Entrepreneurship",
            "Bachelor of Science in Office Administration"
        ],
        "College of Criminal Justice Education": [
            "Bachelor in Public Administration",
            "Bachelor of Science in Criminology"
        ],
        "College of Computing Studies": [
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology"
        ],
        "College of Education": [
            "Bachelor in Secondary Education Major in Science",
            "Bachelor in Secondary Education Major in Mathematics",
            "Bachelor in Secondary Education Major in Filipino",
            "Bachelor in Special Needs Education",
            "Bachelor in Technology and Livelihood Education Major in Home Economics",
            "Bachelor in Technology and Livelihood Education Major in Industrial Arts",
            "Professional Education Subjects (TCP)"
        ],
        "College of Engineering": [
            "Bachelor of Science in Chemical Engineering",
            "Bachelor of Science in Civil Engineering",
            "Bachelor of Science in Electrical Engineering",
            "Bachelor of Science in Electronics and Communication Engineering",
            "Bachelor of Science in Mechanical Engineering",
            "Bachelor of Science in Computer Engineering"
        ],
        "College of Hospitality and Tourism Management": [
            "Bachelor of Science in Tourism Management",
            "Bachelor of Science in Hospitality Management"
        ],
        "College of Industrial Technology": [
            "Bachelor of Science in Industrial Technology Major in Automotive Technology",
            "Bachelor of Science in Industrial Technology Major in Electrical Technology",
            "Bachelor of Science in Industrial Technology Major in Electronics Technology",
            "Bachelor of Science in Industrial Technology Major in Food Technology",
            "Bachelor of Science in Industrial Technology Major in Fashion and Apparel Technology",
            "Bachelor of Science in Industrial Technology Major in Industrial Chemistry",
            "Bachelor of Science in Industrial Technology Major in Drafting Technology",
            "Bachelor of Science in Industrial Technology Major in Machine Shop Technology",
            "Bachelor of Science in Industrial Technology Major in Refrigeration and Air Conditioning"
        ],
        "Graduate School Doctoral Program": [
            "Doctor of Philosophy Industrial Psychology",
            "Doctor of Education Educational Management",
            "Doctor in Business Administration",
            "Doctor in Public Administration"
        ],
        "Graduate School Master Program": [
            "Master of Science in Mathematics",
            "Master of Arts in Industrial Psychology",
            "Master in Business Administration",
            "Master in Public Administration",
            "Master of Arts in Industrial Education Hotel Management",
            "Master of Arts in Education Administration and Supervision",
            "Master of Arts in Education Guidance and Counseling",
            "Master of Arts in Education Special Education",
            "Master of Arts in Teaching Electronics Technology",
            "Master of Arts in Teaching Mathematics",
            "Master of Arts in Teaching Science"
        ]
    };


    return (
        <Box sx={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: 1, backgroundColor: 'transparent' }}>

            <Container className="mt-8">
                <div className="flex-container">
                    <div className="section">

                        <Container

                            sx={{
                                width: "100%",
                                backgroundColor: "#6D2323",
                                border: "2px solid black",
                                maxHeight: "500px",
                                overflowY: "auto",
                                color: "white",
                                marginLeft: "40px",
                                borderRadius: 2,
                                boxShadow: 3,
                                padding: "4px",
                            }}
                        >
                            <Box sx={{ width: "%" }}>
                                <Typography style={{ fontSize: "30px", padding: "10px", fontFamily: "Arial Black", textAlign: "center" }}>EXAMINATION PERMIT </Typography>
                            </Box>
                        </Container>
                        <Container sx={{ marginLeft: "40px", width: "100%", backgroundColor: "white", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>


                            <button
                                onClick={printDiv}
                                style={{
                                    marginBottom: "1rem",
                                    padding: "10px 20px",
                                    border: "2px solid black",
                                    backgroundColor: "#f0f0f0",
                                    color: "black",
                                    borderRadius: "5px",
                                    marginTop: "20px",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s, transform 0.2s",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                                onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                                onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                            >
                                Print Table
                            </button>
                            <div ref={divToPrintRef}>
                                <div>
                                    <style>
                                        {`
          @media print {
            button {
              display: none;
            }

          }
        `}
                                    </style>




                                </div>
                                <div className="section">

                                    <table
                                        className="student-table"
                                        style={{

                                            borderCollapse: "collapse",
                                            fontFamily: "Arial, Helvetica, sans-serif",
                                            width: "8in",
                                            margin: "0 auto", // Center the table inside the form
                                            textAlign: "center",
                                            tableLayout: "fixed",
                                        }}
                                    >
                                        <style>
                                            {`
                  @media print {
                    .Box {
                      display: none;
                    }

                  }
                `}
                                        </style>

                                        <tbody>
                                            <tr>
                                                <td colSpan={2} style={{ height: "0.1in", fontSize: "72.5%" }}>
                                                    <b>

                                                    </b>
                                                </td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                                <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} style={{ height: "0.1in", fontSize: "62.5%" }}>

                                                </td>
                                            </tr>
                                            <tr>

                                                <td colSpan={40} style={{ height: "0.5in", textAlign: "center" }}>
                                                    <table width="100%" style={{ borderCollapse: "collapse" }}>
                                                        <tbody>
                                                            <tr>


                                                                <td style={{ width: "20%", textAlign: "center" }}>
                                                                    <img src={EaristLogo} alt="Earist Logo" style={{ marginLeft: "10px", width: "140px", height: "140px" }} />
                                                                </td>

                                                                {/* Center Column - School Information */}
                                                                <td style={{ width: "60%", textAlign: "center", lineHeight: "1" }}>
                                                                    <div>Republic of the Philippines</div>
                                                                    <b style={{ letterSpacing: '1.5px' }}>Eulogio "Amang" Rodriguez</b>
                                                                    <div style={{ letterSpacing: '1.5px' }}><b>Institute of Science and Technology</b></div>
                                                                    <div>Nagtahan St. Sampaloc, Manila</div>

                                                                    {/* Add spacing here */}
                                                                    <div style={{ marginTop: "30px" }}>
                                                                        <b style={{ fontSize: "20px", letterSpacing: '1px' }}>
                                                                            EXAMINATION PERMIT
                                                                        </b>
                                                                    </div>
                                                                </td>

                                                                <td
                                                                    colSpan={4}
                                                                    rowSpan={6}
                                                                    style={{
                                                                        textAlign: "center",
                                                                        position: "relative",
                                                                        width: "4.5cm",
                                                                        height: "4.5cm",
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            width: "4.58cm",
                                                                            height: "4.58cm",
                                                                            marginRight: "10px",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            position: "relative",
                                                                            border: "1px solid #ccc",


                                                                        }}
                                                                    >
                                                                        {profilePicture ? (
                                                                            <img
                                                                                src={profilePicture}
                                                                                alt="Profile"
                                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                            />
                                                                        ) : (
                                                                            <span style={{ fontSize: "12px", color: "#666" }}>
                                                                                No Profile Picture Found
                                                                            </span>
                                                                        )}

                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>

                                            </tr>


                                        </tbody>
                                    </table>
                                    <div style={{ height: "30px" }}></div>
                                    <table
                                        className="student-table"
                                        style={{
                                            borderCollapse: "collapse",
                                            fontFamily: "Arial, Helvetica, sans-serif",
                                            width: "8in",
                                            margin: "0 auto",


                                            textAlign: "center",
                                            tableLayout: "fixed",
                                        }}
                                    >

                                        <tbody>
                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={40}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "flex-end",     // align the whole block to the right
                                                            width: "100%",
                                                            marginLeft: "2px"
                                                        }}
                                                    >
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                                                            Applicant No.:
                                                        </label>
                                                        <span style={{ display: "inline-block", width: "280px", borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Email & Applicant ID */}
                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Name:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Permit No.:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Course Applied:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Major:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Date of Exam:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Time :</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Bldg. :</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "60%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Room No. :</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Scheduled by:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>

                                            </tr>
                                            <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                                                <td colSpan={20}>
                                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                        <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Date:</label>
                                                        <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.2em" }}></span>
                                                    </div>
                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>


                                    <div style={{ height: "40px" }}></div>

                                      <table
                                        className="student-table"
                                        style={{

                                            borderCollapse: "collapse",
                                            fontFamily: "Arial, Helvetica, sans-serif",
                                            width: "8in",
                                            margin: "0 auto", // Center the table inside the form
                                            textAlign: "center",
                                            tableLayout: "fixed",
                                            border: "1px solid black"
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    colSpan={40}
                                                    style={{
                                                        textAlign: "justify",
                                                        color: "black",
                                                        padding: "8px",
                                                        lineHeight: "1.5",
                                                        textAlign: "Center",

                                                        fontSize: "14px",
                                                        fontFamily: "Arial, Helvetica, sans-serif",

                                                        fontWeight: "200px"
                                                    }}
                                                >
                                                    <strong>
                                                        <div>NOTE: Please bring this examination permit on the examination day together with</div>
                                                        <div>Two short bond paper, pencil w/ erasers & ballpen. Please come on decent attire</div>
                                                        <div>(no sleeveless or shorts) at least 1 hour before the examination</div>
                                                    </strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                        </Container>



                    </div>


                </div>
            </Container>
        </Box>
    );
};

export default ExaminationProfile;
