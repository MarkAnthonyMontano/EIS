
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ClassList = () => {
  const { curriculum_id } = useParams();
  const [sections, setSections] = useState([]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/class_roster/${curriculum_id}`);
      setSections(response.data);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [curriculum_id]);

  return (
    <div>
      <h2>Sections under Curriculum {curriculum_id}</h2>
      {sections.length === 0 ? (
        <p>No sections found.</p>
      ) : (
        <ul>
          {sections.map((section, index) => (
            <li key={index}>
              <Link to={`/class_list/ccs/${curriculum_id}/${section.id}`}>
                {section.description}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassList;
