const generateResultCall = async (payload) => {
    const response = await fetch("http://localhost:8000/api/generate_sql_query/",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
    });
    return response.json()
}

const fetchAllTables = async () => {
    const response = await fetch("http://localhost:8000/api/tables/");
    if (!response.ok) {
        throw new Error('Tables data could not be fetched');
    } else {
        return response.json()
    }
}

export default {generateResultCall, fetchAllTables};