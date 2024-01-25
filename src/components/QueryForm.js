import React, { useEffect } from 'react';
import { Box, TextField, LinearProgress ,
    Paper, Toolbar, AppBar, FormControl, MenuItem, InputLabel, Select, Typography, Button, Alert, Stack } from '@mui/material';
import OpenAIServices from '../servcies/OpenAIServices';

const QueryForm = () => {
    const[tables, setTables] = React.useState([]);
    const[selectedTable, setSelectedTable] = React.useState('');
    const[userRequirement, setUserRequirement] = React.useState('');
    const[userRequiredResult, setUserRequiredResult] = React.useState('');
    const[executingResults, setExecutingResults] = React.useState(false);

    useEffect(() => {
        OpenAIServices.fetchAllTables().then((response) => {
            console.log(response);
            setTables([]);
            response.map((table) => {
                setTables((tableVar) => [...tableVar, table.name]);
            });
        }).catch((error) => {
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity="error">Unable to fetch tables </Alert>
            </Stack>
        })
    },[]);

    const onChangeOfSelectedTable = (event) => {
        setSelectedTable(event.target.value);
    }

    const onChangeOfUserRequirement = (event) => {
        setUserRequirement(event.target.value);
    }

    const handleGenerateResult = () => {
        setExecutingResults(true);
        setUserRequiredResult('Please wait while we are generating the results ...');
        const payload = {
            "table_name": selectedTable,
            "natural_language_query": userRequirement
        }
        OpenAIServices.generateResultCall(payload).then((response) => {
            setUserRequiredResult(formatSQLQuery(response.sql_query));
            setExecutingResults(false);
        }).catch((error) => {
            setExecutingResults(false);
            setUserRequiredResult('');
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity="error">Unable to invoke generate result request </Alert>
            </Stack>
        })
    }

    const checkRequiredFields = () => {
        return selectedTable === '' || userRequirement === '';
    }

    const renderAvailableTables = () => {
        return tables.map((table) => {
            return (
                <MenuItem value={table}>
                    {table}
                </MenuItem>
            )
        })
    }

    const formatSQLQuery = (sqlQuery) => { 
        if(sqlQuery === '' || sqlQuery === null || sqlQuery === undefined){
            console.log('sqlQuery is empty/null/undefined');
        }
        else{
            let formattedSQLQuery = '';
            formattedSQLQuery = sqlQuery.replaceAll("```", "").substring(3, sqlQuery.length);
            console.log("Before format"+sqlQuery);
            console.log("After format"+formattedSQLQuery);
            return formattedSQLQuery;
        }
    }

    return (
        <Box style={{maxHeight: '800px' , overflow: 'auto', color: '#EAE4E3'}}>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'white'}}>
                    Query Generator Bot
                </Typography>
                </Toolbar>
            </AppBar>   
            <Paper elevation={3} sx={{minHeight: '500px', margin: ' 20px 10px 10px 10px'}}>
                <FormControl sx={{m:2, marginLeft: '38%',minWidth: '27%'}}>
                    <InputLabel id="select-table-label=p">Please select the tables</InputLabel>
                    <Select
                    labelId="select-table-label"
                    id="select-table-label"
                    value={selectedTable}
                    label="Please select the tables"
                    onChange={onChangeOfSelectedTable}
                    autoWidth
                    >
                        {renderAvailableTables()}
                    </Select>
                 </FormControl>
                 <Box sx={{m:2, marginLeft: '28%'}}
                    component="form"
                    noValidate
                    autoComplete="on"
                    >
                        <TextField
                            id="outlined-multiline-flexible-user-requirement"
                            label="Please provide your requirement"
                            multiline
                            maxRows={4}
                            sx={{width: '65%'}}
                            onChange={onChangeOfUserRequirement}
                        />
                 </Box>
                 <Button variant="contained" disableElevation disabled={checkRequiredFields()} 
                 sx={{m:2, marginLeft: '38%', width: '27%'}}
                 onClick={handleGenerateResult}>
                    {executingResults ? 'Generating Results ...' : 'Generate Results'}
                 </Button>
                {executingResults && <LinearProgress sx={{marginTop: '0px', marginLeft: '38%', width: '27%'}}/>}
                    <Box sx={{m:2, height: '400px'}}>
                        <TextField
                            id="outlined-multiline-flexible-user-requirement-result"
                            label="click on generate result button to see the result"
                            multiline
                            fullWidth
                            rows={10}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{width: '100%', height: '800px'}}
                            value={userRequiredResult}
                        />
                    </Box>
            </Paper>
        </Box>
    );
};

export default QueryForm;
