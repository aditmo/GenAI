// src/components/QueryForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueryForm = () => {
  const [table, setTable] = useState('');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [tableOptions, setTableOptions] = useState([]);

  useEffect(() => {
    const fetchTableOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tables/');
        console.log('API Response:', response.data);
        setTableOptions(response.data);
      } catch (error) {
        console.error('Error fetching table options:', error);
      }
    };

    fetchTableOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/generate_sql_query/', {
        table_name: table,
        natural_language_query: naturalLanguageQuery,
      });

      setSqlQuery(response.data.sql_query);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h2>Query Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Table:
          <select value={table} onChange={(e) => setTable(e.target.value)}>
            <option value="" disabled>Select a table</option>
            {tableOptions.map((option) => (
              <option key={option.id} value={option.name}>{option.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Natural Language Query:
          <input type="text" value={naturalLanguageQuery} onChange={(e) => setNaturalLanguageQuery(e.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={!table}>Generate SQL Query</button>
      </form>
      {sqlQuery && (
        <div>
          <h3>Generated SQL Query:</h3>
          <code>{sqlQuery}</code>
        </div>
      )}
    </div>
  );
};

export default QueryForm;
