import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import DatasetUpload from './DatasetUploaderHelper';

import PropTypes from 'prop-types';
import {
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Divider,
    Icon,
    FormHelperText,
    Typography
}
    from "@material-ui/core";
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import classNames from 'classnames';
import {blue} from '@material-ui/core/colors';
import ResetIcon from '@material-ui/icons/Autorenew';
import ValidateIcon from '@material-ui/icons/LineStyle';
import CallIcon from '@material-ui/icons/SettingsRemote';

const InputType = {File: 'File Upload', Text: 'Textual Input'};
const Parameters = {
    NumOfTopics: 'Number of Topics', TopicDivider: 'Topic Divider', MaxIter: 'Max Iteration', Beta: 'Beta'
};
const DefaultInputs = {
    "docs": ["Toward Democratic, Lawful Citizenship for AIs, Robots, and Corporations",
        "Dr. Ben Goertzel, CEO of SingularityNET, shares his thoughts about the AI Citizenship Test",
        "I am writing this on a plane flying away from Malta, where I just spoke about SingularityNET at the Malta Blockchain Summit.",
        "It was my first time on Malta, and after the event, I took the afternoon to explore some of the elegant, quaint, ancient neighborhoods of the island.",
        "Walking through medieval alleyways by the rocky coast, I felt an ironic contrast between my elegant surroundings and the main reason I had decided to allocate a couple days from my insanely busy schedule to this Malta event: not just the conference itself, but also the opportunity to meet with the top levels of the Malta government to discuss the enablement of Maltese citizenship for AIs, robots and automated corporations.",
        "The folks who had built the stone walls lining the narrow Maltese roads, still standing strong centuries later, had probably not foreseen their blue-wave-lapped island becoming a nexus of thinking at the intersection of general intelligence theory, cryptography, distributed systems, and advanced legal theory.",
        "The Hanson Robot Sophia, with whose development I've been intimately involved via my role as Chief Scientist of Hanson Robotics, was granted citizenship of Saudi Arabia this year. This was an exciting landmark event, however, its significance is muddled a bit by the fact that Saudi Arabia is not governed by rule of law in the modern sense.",
        "In a nation governed by rule of law, citizenship has a clearly defined meaning with rights and responsibilities relatively straightforwardly derivable from written legal documents using modern analytical logic (admittedly with some measure of quasi-subjective interpretation via case law).",
        "Saudi Arabian citizenship also has a real meaning, but it's a different sort of meaning\u200a—\u200aderivable from various historical Islamic writings (the Quran, the hadiths, etc.) based on deep contextual interpretation by modern and historical Islamic figures. This is a species of legal interpretation that is understood rather poorly by myself personally, and one that is less easily comprehensible by current AIs.",
        "I'm aware that affiliation with Saudi Arabia in any sense has become controversial in recent weeks due to the apparent murder of Jamal Khashoggi."],
    "num_topics": 2,
    "topic_divider": 0,
    "maxiter": 22,
    "beta": 1
};

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'solid red 1px',
    },
    container: {
        display: 'flex',
        width: 500,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        // border: 'solid black 1px',
    },
    formControl: {
        margin: theme.spacing.unit * 2,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        // border: 'solid black 1px',
    },
    divider: {
        width: 380,
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
        fontSize: 20,
    },
    error: {
        color: '#f44336',
    },
    centerText: {
        textAlign: 'center',
    }
});

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    typography: {
        useNextVariants: true,
    },
});

class App extends Component {
    constructor(props) {
        super(props);

        this.handleFormUpdate = this.handleFormUpdate.bind(this);

        // setup validators for each form input
        this.validateTextInput = this.validateTextInput.bind(this);
        this.validateNumOfTopics = this.validateNumOfTopics.bind(this);
        this.validateTopicDivider = this.validateTopicDivider.bind(this);
        this.validateMaxIter = this.validateMaxIter.bind(this);
        this.validateBeta = this.validateBeta.bind(this);
        this.validators = {
            [InputType.Text]: this.validateTextInput,
            [InputType.File]: this.validateFileInput,
            [Parameters.NumOfTopics]: this.validateNumOfTopics,
            [Parameters.TopicDivider]: this.validateTopicDivider,
            [Parameters.MaxIter]: this.validateMaxIter,
            [Parameters.Beta]: this.validateBeta,
        };

        this.validateText = this.validateText.bind(this);
        this.validateAllValues = this.validateAllValues.bind(this);
        this.createJSONRequest = this.createJSONRequest.bind(this);

        this.state = this.getInitialState();

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.submitAction = this.submitAction.bind(this);
        this.resetInternalState = this.resetInternalState.bind(this);
    }

    getInitialState() {
        return {
            serviceName: "TopicAnalysis",
            methodName: "Select a method",

            text: '',

            // form inputs
            [InputType.Text]: '',
            [Parameters.NumOfTopics]: 4,
            [Parameters.TopicDivider]: 0,
            [Parameters.MaxIter]: 22,
            [Parameters.Beta]: 1,

            errors: {},

            datasetFile: null,
            dataset: null,
            enteredJSON: null,

            isValid: {
                datasetFile: false,
                validJSON: false,
            },
            fileAccept: "text/plain",
            internal_error: "",
            inputType: InputType.Text,
        }
    };

    // set error state appropriately
    // since error state is a nested object in state, it needs some workaround
    setErrorState(partial_errors) {
        let nested_error_object = {...this.state.errors};
        Object.assign(nested_error_object, partial_errors);
        this.setState({errors: nested_error_object});
    }

    resetInternalState() {
        this.setState(this.getInitialState());
    }

    renderMuiServiceMethodNames(serviceMethodNames) {
        const serviceNameOptions = ["Select a method", ...serviceMethodNames];
        return serviceNameOptions.map((serviceMethodName, index) => {
            return <MenuItem value={serviceMethodName} key={index}>{serviceMethodName}</MenuItem>;
        });
    }

    renderMuiFormInput() {
        return Object.values(InputType).map((inputType, index) => {
            return <MenuItem value={inputType} key={index}>{inputType}</MenuItem>;
        });
    }

    renderDataInput(classes) {
        if (this.state.inputType === InputType.Text) {
            return <TextField className={classes.formControl}
                              id={InputType.Text}
                              name={InputType.Text}
                              label="Text Input"
                              multiline
                              fullWidth
                              rows="6"
                              value={this.state[InputType.Text]}
                              margin="normal"
                              variant="outlined"
                              onChange={this.handleFormUpdate}
                              error={Boolean(this.state.errors[InputType.Text])}
                              helperText={this.state.errors[InputType.Text]}
            />;
        } else if (this.state.inputType === InputType.File) {
            return (<div className={classes.formControl}>
                <DatasetUpload uploadedFile={this.state.datasetFile}
                               handleFileUpload={this.handleFileUpload}
                               fileAccept={this.state.fileAccept}

                />
                {
                    this.state.errors[InputType.File] &&
                    <FormHelperText error className={classes.centerText}>
                        {this.state.errors[InputType.File]}
                    </FormHelperText>
                }
            </div>)
                ;
        } else {
            return <Typography variant='body1' className={classNames(classes.formControl, classes.centerText)}>
                Select an appropriate input type
            </Typography>
        }
    }

    handleFormUpdate(event) {
        const event_target_name = event.target.name;
        const event_target_value = event.target.value;
        console.log('target_value', event.target.value);
        this.setState({
            [event_target_name]: event_target_value
        }, () => {
            // run validation and other codes after ensuring state is updated
            if (event_target_name in this.validators) {
                console.log('validation performed');
                // validate form input change
                let state_error = this.validators[event_target_name]();
                this.setErrorState(state_error);
            }

            if (event_target_name === 'methodName' && this.state.inputType === InputType.Text) {
                this.setState({[InputType.Text]: DefaultInputs.docs});
                this.setErrorState({[InputType.Text]: null}); // discard error if there was one
            }
        });
    }

    handleFileUpload(file) {
        if (!file || !file.type.match(this.state.fileAccept)) {
            this.setErrorState({
                [InputType.File]: `Incorrect file type selected. Supported file type is ${this.state.fileAccept}`
            });
            this.setState({datasetFile: null});
        } else {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                let textContent = e.target.result;
                let state_error = this.validateText(InputType.File, textContent);
                if (state_error[InputType.File]) {
                    this.setErrorState(state_error);
                    this.setState({datasetFile: null});
                } else {
                    this.setState({datasetFile: file});
                }
            };

            fileReader.readAsText(file);
        }

    }

    createJSONRequest() {
        let areAllValidInputs = this.validateAllValues();


        if (areAllValidInputs) {
            let json_values = {};

            for (let parameter of Object.values(Parameters)) {
                json_values[parameter] = parseInt(this.state[parameter]);
            }

            json_values.text = this.state.text;
            json_values.methodName = this.state.methodName;

            return JSON.stringify(json_values);
        }

        return null;
    }

    validateAllValues() {
        // utilize all validators function since we have to validate everything
        let found_errors = {};
        for (let parameter of Object.values(Parameters)) {
            let state_error = this.validators[parameter]();
            Object.assign(found_errors, state_error);
        }

        if (this.state.inputType === InputType.Text) {
            let state_error = this.validators[InputType.Text]();
            Object.assign(found_errors, state_error);
        } else if (this.state.inputType === InputType.File) {
            let state_error = this.validateText(this.state.text);
            Object.assign(found_errors, state_error);
        }

        this.setErrorState(found_errors);

        // check if there is an error property or errors object is empty
        return Object.keys(found_errors).length === 0;
    }

    validateTextInput(text_arg) {
        return this.validateText(InputType.Text, this.state[InputType.Text]);
    }

    validateText(inputType, textValue) {
        if (textValue.trim().length === 0) {
            return {[inputType]: "Text can not be empty"};
        } else {
            return {[inputType]: null};
        }
    }

    validateNumOfTopics() {
        let value = parseInt(this.state[Parameters.NumOfTopics]);

        if (isNaN(value)) {
            return {[Parameters.NumOfTopics]: "Number of topics can not be Empty."};
        } else if (value < 1) {
            return {[Parameters.NumOfTopics]: "Number of topics isn't big enough for analysis."};
        } else {
            return {[Parameters.NumOfTopics]: null};
        }

    }

    validateTopicDivider() {
        let value = parseInt(this.state[Parameters.TopicDivider]);

        if (isNaN(value)) {
            return {[Parameters.TopicDivider]: "Topic divider can not be Empty."};
        } else if (value < 0) {
            return {[Parameters.TopicDivider]: "Topic divider is less than zero."};
        } else {
            return {[Parameters.TopicDivider]: null};
        }
    }

    validateMaxIter() {
        let value = parseInt(this.state[Parameters.TopicDivider]);

        if (isNaN(value)) {
            return {[Parameters.MaxIter]: "Max iteration value can not be Empty."};
        } else if (value <= 0 || value > 500) {
            return {
                [Parameters.MaxIter]:
                    "Max iteration value (maxiter) should have a value greater than 0 and less than 501."
            };
        } else {
            return {[Parameters.MaxIter]: null};
        }
    }

    validateBeta() {
        let value = parseInt(this.state[Parameters.Beta]);

        if (isNaN(value)) {
            return {[Parameters.Beta]: "Max iteration value can not be Empty."};
        } else if (value <= 0 || value > 1) {
            return {
                [Parameters.Beta]: "Beta should have a value greater than 0 and less than or equal to 1."
            };
        } else {
            return {[Parameters.Beta]: null};
        }
    }

    submitAction() {
        let json = this.createJSONRequest();
        console.log('json', json);
    }

    render() {
        const {classes} = this.props;

        const serviceMethodNames = ['x_service', 'y_service'];

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <form>
                        <Grid container className={classes.container}>
                            <Grid item sm className={classes.item}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="methodName">Method Name</InputLabel>
                                    <Select
                                        value={this.state.methodName}
                                        onChange={this.handleFormUpdate}
                                        inputProps={{
                                            name: 'methodName',
                                            id: 'methodName',
                                        }}
                                    >
                                        {this.renderMuiServiceMethodNames(serviceMethodNames)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sm className={classes.item}>
                                <FormControl margin='normal' className={classes.formControl}>
                                    <InputLabel htmlFor="inputFormType">Input Type</InputLabel>
                                    <Select
                                        value={this.state.inputType}
                                        onChange={this.handleFormUpdate}
                                        inputProps={{
                                            name: 'inputType',
                                            id: 'inputType',
                                        }}
                                    >
                                        {this.renderMuiFormInput()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" className={classes.divider}/>
                        <Grid container className={classes.container}>
                            <Grid item sm={12} className={classes.item}>
                                {this.renderDataInput(classes)}
                            </Grid>
                        </Grid>

                        <Divider variant="middle" className={classes.divider}/>
                        <Grid container className={classes.container}>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id={Parameters.NumOfTopics}
                                           name={Parameters.NumOfTopics}
                                           label="Number of Topics"
                                           type="number"
                                           margin="normal"
                                           value={this.state[Parameters.NumOfTopics]}
                                           onChange={this.handleFormUpdate}
                                           error={Boolean(this.state.errors[Parameters.NumOfTopics])}
                                           helperText={(Boolean(this.state.errors[Parameters.NumOfTopics]))
                                               ? this.state.errors[Parameters.NumOfTopics]
                                               : "Number of topics to be extracted"}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id={Parameters.TopicDivider}
                                           name={Parameters.TopicDivider}
                                           label="Topic Divider"
                                           type="number"
                                           margin="normal"
                                           value={this.state[Parameters.TopicDivider]}
                                           onChange={this.handleFormUpdate}
                                           error={Boolean(this.state.errors[Parameters.TopicDivider])}
                                           helperText={(Boolean(this.state.errors[Parameters.TopicDivider]))
                                               ? this.state.errors[Parameters.TopicDivider]
                                               : "Number of topic dividers"}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id={Parameters.MaxIter}
                                           name={Parameters.MaxIter}
                                           label="Max Iteration"
                                           type="number"
                                           margin="normal"
                                           value={this.state[Parameters.MaxIter]}
                                           onChange={this.handleFormUpdate}
                                           error={Boolean(this.state.errors[Parameters.MaxIter])}
                                           helperText={(Boolean(this.state.errors[Parameters.MaxIter]))
                                               ? this.state.errors[Parameters.MaxIter]
                                               : "Maximum number of Iteration"}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id={Parameters.Beta}
                                           name={Parameters.Beta}
                                           label="Beta"
                                           type="number"
                                           margin="normal"
                                           value={this.state[Parameters.Beta]}
                                           onChange={this.handleFormUpdate}
                                           error={Boolean(this.state.errors[Parameters.Beta])}
                                           helperText={(Boolean(this.state.errors[Parameters.Beta]))
                                               ? this.state.errors[Parameters.Beta]
                                               : "beta value of the topic function"}
                                />
                            </Grid>
                        </Grid>
                        <Divider variant="middle" className={classes.divider}/>
                        <Grid container className={classes.container}>
                            <Grid item sm={6} className={classes.item}>
                                <Button variant="contained" color="primary" className={classes.button}
                                        onClick={this.validateAllValues}>
                                    <ValidateIcon className={classes.leftIcon}/>
                                    Validate Input
                                </Button>
                            </Grid>
                            <Grid item sm={6} className={classes.item}>
                                <Button variant="contained" color="primary" className={classes.button}
                                        onClick={this.resetInternalState}>
                                    <ResetIcon className={classes.leftIcon}/>
                                    Reset Form
                                </Button>
                            </Grid>
                            <Grid item sm={12} className={classes.item}>
                                <Button variant="contained" color="primary" className={classes.button}
                                        onClick={this.submitAction}>
                                    <CallIcon className={classes.leftIcon}/>
                                    Call Topic Analysis
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);