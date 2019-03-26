import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import PropTypes from 'prop-types';
import { Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, MenuItem, Select, Divider }
  from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { blue } from '@material-ui/core/colors';

const InputView = { File: 'File Upload', Text: 'Textual Input' };
const SampleInput = {
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
    width: 400,
    marginTop: theme.spacing.unit * 8,
    border: 'solid black 1px',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  item: {
    display: 'flex',
    border: 'solid black 1px',
  }
});

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    useNextVariants: true,
    fontSize: 18,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      serviceName: "TopicAnalysis",
      methodName: "Select a method",
      datasetFile: null,
      dataset: null,
      enteredJSON: null,
      isValid: {
        datasetFile: false,
        validJSON: false,
      },
      fileAccept: ".json",
      internal_error: "",
      inputFormType: InputView.Text,
    }
  };

  renderMuiServiceMethodNames(serviceMethodNames) {
    const serviceNameOptions = ["Select a method", ...serviceMethodNames];
    return serviceNameOptions.map((serviceMethodName, index) => {
      return <MenuItem value={serviceMethodName} key={index}>{serviceMethodName}</MenuItem>;
    });
  }

  renderMuiFormInput() {
    const inputOptions = ["File Upload", "Textual Input"];
    return inputOptions.map((inputOption, index) => {
      return <MenuItem value={inputOption} key={index}>{inputOption}</MenuItem>;
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      {/* <form> */}
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
                {this.renderMuiServiceMethodNames(["x_service", "y_service"])}
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
          <Divider variant="middle" />
          <Grid container className={classes.container}>
          <Grid item sm={12} className={classes.item}>
            <TextField className={classes.formControl}
              id="standard-multiline-static"
              label="Multiline"
              multiline
              fullWidth
              rows="4"
              defaultValue="Default Value"
              margin="normal"
              variant="outlined"
            />
          </Grid>
          </Grid>
          
          <Divider variant="middle" />
          <Grid container className={classes.container}>
          <Grid item sm>
            <TextField className={classes.formControl}
              id="numOfTopics"
              label="Number of Topics"
              type="number"
              defaultValue="4"
              margin="normal"
              helperText="beta value of the topic function"
            />
          </Grid>
          <Grid item sm>
            <TextField className={classes.formControl}
              id="s"
              label="Topic Divider"
              type="number"
              defaultValue="0"
              margin="normal"
              helperText="beta value of the topic function"
            />
          </Grid>
          <Grid item sm>
            <TextField className={classes.formControl}
              id="s"
              label="Max Iteration"
              type="number"
              defaultValue="22"
              margin="normal"
              helperText="beta value of the topic function"
            />
          </Grid>
          <Grid item sm>
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
      {/* </form> */}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);