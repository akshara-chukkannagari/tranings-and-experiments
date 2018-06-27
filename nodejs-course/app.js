const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

const argv = yargs.argv;
const command = (argv._[0] && argv._[0].toLowerCase()) || '?';
console.log(`Command: ${command}`);

if (command === 'add') {
  const note = notes.addNote(argv.title, argv.body);
  if (_.isObject(note)) {
    console.log('Note created');
    notes.logNote(note);
  } else if (note) {
    console.log(note);
  }
} else if (command === 'list') {
  notes.getAll();
} else if (command === 'read') {
  const note = notes.getNote(argv.title);
  if (_.isObject(note)) {
    console.log('The Note');
    notes.logNote(note);
  } else {
    console.log('Cannot find this note');
  }
} else if (command === 'remove') {
  const noteRemoved = notes.removeNote(argv.title);
  const message = noteRemoved
    ? `Note "${argv.title} is removed`
    : 'Note was not removed';
  console.log(message);
} else {
  console.log('Usage: app.js [add | list]');
}
