import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClassRoster = () => {
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  // Fetch list of departments on page load
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_department');
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  // Fetch list of programs for the selected department
  const fetchPrograms = async (deptId) => {
    setSelectedDept(deptId); // ✅ Set selected department immediately

    try {
      const response = await axios.get(`http://localhost:5000/class_roster/ccs/${deptId}`);
      setPrograms(response.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setPrograms([]); // Clear programs on error
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-[20px] mt-[2rem] mb-[1rem] font-bold">Class Roster</h1>

      <h3 className="mb-[1rem] font-semibold">Select a Department:</h3>

      {/* Department Buttons */}
      <div className="flex flex-wrap gap-2">
        {departments.map(dept => (
          <button
            key={dept.dprtmnt_id}
            onClick={() => fetchPrograms(dept.dprtmnt_id)}
            className={`p-2 w-[100px] border border-black rounded font-semibold 
              ${selectedDept === dept.dprtmnt_id ? 'bg-maroon-500 text-white' : 'text-black bg-white'}`}
          >
            {dept.dprtmnt_code}
          </button>
        ))}
      </div>

      {/* Program Section */}
      <div className="mt-6">
        {/* If department is selected but no programs */}
        {selectedDept && programs.length === 0 && (
          <div className="text-gray-600 italic">
            There are no programs in the selected department.
          </div>
        )}

        {/* If programs are available */}
        {programs.length > 0 && (
          <>
            <div className="font-bold mb-2">
              {programs[0].dprtmnt_name} ({programs[0].dprtmnt_code})
            </div>

            {programs.map(program => (
              <div key={program.program_id} className="mb-1">
                <Link
                  to={`class_list/ccs/${program.curriculum_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {program.program_description} ({program.program_code})
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassRoster;