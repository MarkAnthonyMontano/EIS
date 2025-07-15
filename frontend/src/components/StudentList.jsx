import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const { curriculum_id, dstID } = useParams();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/class_roster/${curriculum_id}/${dstID}`);
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching student list:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [curriculum_id, dstID]);

  return (
    <div>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.student_number}</td>
                <td>{student.last_name}</td>
                <td>{student.first_name}</td>
                <td>{student.middle_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;

