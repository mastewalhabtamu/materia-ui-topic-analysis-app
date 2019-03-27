import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import DatasetUpload from './DatasetUploaderHelper';

import PropTypes from 'prop-types';
import {
    Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, MenuItem, Select, Divider, Icon, FormHelperText
}
    from "@material-ui/core";
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core/styles";
import {blue} from '@material-ui/core/colors';
import ResetIcon from '@material-ui/icons/Autorenew';
import ValidateIcon from '@material-ui/icons/LineStyle';
import CallIcon from '@material-ui/icons/SettingsRemote';

const InputType = {File: 'File Upload', Text: 'Textual Input'};
const Parameters = {
    NumOfTopics: 'Number of Topics', TopicDivider: 'Topic Divider', MaxIter: 'Max Iteration', Beta: 'Beta'
}
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
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        border: 'solid black 1px',
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
        border: 'solid black 1px',
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
            [Parameters.NumOfTopics]: this.validateNumOfTopics,
            [Parameters.TopicDivider]: this.validateTopicDivider,
            [Parameters.MaxIter]: this.validateMaxIter,
            [Parameters.Beta]: this.validateBeta,
        };
        this.validateAll = this.validateAll.bind(this);
        this.validateRequest = this.validateRequest.bind(this);

        this.state = this.getInitialState();

        this.submitAction = this.submitAction.bind(this);
        this.resetInternalState = this.resetInternalState.bind(this);
    }

    getInitialState() {
        return {
            serviceName: "TopicAnalysis",
            methodName: "Select a method",

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
            fileAccept: ".json",
            internal_error: "",
            inputFormType: InputType.Text,
        }
    };

    // set error state appropriately
    // since error state is a nested object in state, it needs some workaround
    setErrorState(partial_errors) {
        let nested_error_object = {...this.state.errors};
        console.log('nested error object:', nested_error_object);
        Object.assign(nested_error_object, partial_errors);
        console.log('updated error object:', nested_error_object);
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
        if (this.state.inputFormType === InputType.Text) {
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
        } else if (this.state.inputFormType === InputType.File) {
            return <DatasetUpload className={classes.formControl}
                                  uploadedFile={this.state.datasetFile}
                                  handleFileUpload={this.handleFileUpload}
                                  fileAccept={this.state.fileAccept}
                                  // setValidationStatus={valid =>
                                  //     this.setValidationStatus("datasetFile", valid)
                                  // }
            />;
        } else {
            return <div>Select an appropriate type</div>
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
            console.log('waited state:', this.state);

            console.log(event_target_name);
            console.log(this.validators[event_target_name]);
            console.log(Object.keys(this.validators));
            if (event_target_name in this.validators) {
                console.log('validation performed');
                // validate form input change
                let state_error = this.validators[event_target_name]();
                this.setErrorState(state_error);
            }

            if (event_target_name === 'methodName' && this.state.inputFormType === InputType.Text) {
                this.setState({[InputType.Text]: DefaultInputs.docs});
                this.setErrorState({[InputType.Text]: null}); // discard error if there was one
            }
        });
    }

    handleFileUpload(file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            let encoded = fileReader.result.replace(/^data:(.*;base64,)?/, "");
            encoded.length % 4 > 0 &&
            (encoded += "=".repeat(4 - (encoded.length % 4)));
            let user_value = this.validateJSON(atob(encoded));
            let condition = this.validateValues(user_value);
            this.setValidationStatus("validJSON", condition);
            this.setState({datasetFile: file});
        };
    }

    validateRequest(event) {
        let string_area = document.getElementById(InputType.Text);
        let value = string_area.value;

        // Now in this section, we take the function and assert the values
        let user_value = this.validateJSON(value);
        if (user_value === undefined)
            return;
        let condition = this.validateValues(user_value);
        if (condition) {
            string_area.value = JSON.stringify(user_value, undefined, 4);
            this.setState({
                internal_error: ""
            })
        }
        this.setValidationStatus("validJSON", condition);

        event.preventDefault()
    }

    validateAll() {
        // utilize all validators function since we have to validate everything
        const validators = Object.values(this.validators);
        const found_errors = {};
        for (let validator of validators) {
            let state_error = validator();
            Object.assign(found_errors, state_error);
        }
        this.setErrorState(found_errors);

        // check if there is an error property or errors object is empty
        return Object.keys(this.state.errors).length === 0;
    }

    validateValues(user_value) {
        const user_value_keys = Object.keys(user_value);
        const sample_keys = Object.keys(DefaultInputs);
        let found_keys = sample_keys.every(r => user_value_keys.indexOf(r) > -1);
        if (!found_keys) {
            this.setState({
                internal_error: "One or more of docs, num_topics, topic_divider, maxiter or beta is/are missing."
            });
        } else {
            // Now let check the validation of the internal values.
            if (user_value['docs'].length === 0) {
                this.setState({
                    internal_error: "Document or text number is zero"
                });
                return false;
            }
            if (parseInt(user_value['num_topics'], 10) < 1) {
                this.setState({
                    internal_error: "Num topics isn't big enough for analysis."
                });
                return false;
            }
            if (parseInt(user_value['topic_divider'], 10) < 0) {
                this.setState({
                    internal_error: "Topic divider is less than zero."
                });
                return false;
            }
            if (parseInt(user_value['maxiter'], 10) <= 0 || parseInt(user_value['maxiter'], 10) > 500) {
                this.setState({
                    internal_error: "Max iteration value (maxiter) should have a value greater than 0 and less than 501."
                });
                return false;
            }
            if (parseFloat(user_value['beta']) <= 0 || parseFloat(user_value['beta']) > 1) {
                this.setState({
                    internal_error: "Beta should have a value greater than 0 and less than or equal to 1."
                });
                return false;
            }
            this.setState({
                dataset: user_value
            });
            return true;
        }
        return false;
    }

    validateTextInput() {
        if (this.state[InputType.Text].trim().length === 0) {
            return {[InputType.Text]: "Text can not be empty"};
        } else {
            return {[InputType.Text]: null};
        }
    }

    validateNumOfTopics() {
        var value = parseInt(this.state[Parameters.NumOfTopics]);

        if (isNaN(value)) {
            return {[Parameters.NumOfTopics]: "Number of topics can not be Empty."};
        } else if (value < 1) {
            return {[Parameters.NumOfTopics]: "Number of topics isn't big enough for analysis."};
        } else {
            return {[Parameters.NumOfTopics]: null};
        }

    }

    validateTopicDivider() {
        if (this.state[Parameters.TopicDivider] < 0) {
            this.setErrorState(Parameters.TopicDivider, "Topic divider is less than zero.");
        } else {
            this.setErrorState(Parameters.TopicDivider, null);
        }
    }

    validateMaxIter() {
        if (this.state[Parameters.MaxIter] <= 0 || this.state[Parameters.MaxIter] > 500) {
            this.setErrorState(Parameters.MaxIter,
                "Max iteration value (maxiter) should have a value greater than 0 and less than 501.");
        } else {
            this.setErrorState(Parameters.MaxIter, null);
        }
    }

    validateBeta() {
        if (this.state[Parameters.Beta] <= 0 || this.state[Parameters.Beta] > 1) {
            this.setState({
                internal_error: "Beta should have a value greater than 0 and less than or equal to 1."
            });
            return false;
        }
    }

    submitAction() {
        let valid = this.validateAll();
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
                                        value={this.state.inputFormType}
                                        onChange={this.handleFormUpdate}
                                        inputProps={{
                                            name: 'inputFormType',
                                            id: 'inputFormType',
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
                                           id="s"
                                           label="Topic Divider"
                                           type="number"
                                           defaultValue="0"
                                           margin="normal"
                                           helperText="Number of topic dividers"
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id="s"
                                           label="Max Iteration"
                                           type="number"
                                           defaultValue="22"
                                           margin="normal"
                                           helperText="Maximum number of Iteration"
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <TextField className={classes.formControl}
                                           id="s"
                                           label="Beta"
                                           type="number"
                                           defaultValue="1"
                                           margin="normal"
                                           helperText="beta value of the topic function"
                                />
                            </Grid>
                        </Grid>
                        <Divider variant="middle" className={classes.divider}/>
                        <Grid container className={classes.container}>
                            <Grid item sm={6} className={classes.item}>
                                <Button variant="contained" color="primary" className={classes.button}
                                        onClick={this.validateAll}>
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