/*
 * Title: Data CRUD oparation
 * Description: All data CRUD oparation in here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Module Scaffolding Object
const lib = {};

// Base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// create data oparaion to file
lib.create = (dir, file, data, callback) => {
    // Open file for writing or create data
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // Write or create file data and then close the file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error on closing new file or user!');
                        }
                    });
                } else {
                    callback('Error writing or creating new file or user!');
                }
            });
        } else {
            callback('Could not create new file or user, it may already exists!');
        }
    });
};

// Read data oparation to file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update data oparation to file
lib.update = (dir, file, data, callback) => {
    // File open for updating
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            const stringData = JSON.stringify(data);
            // truncate the filr
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // write to file for update and then close the file
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('Error in closing file!');
                                }
                            });
                        } else {
                            callback('Error in writing or updating file!');
                        }
                    });
                } else {
                    callback('Error in trancate file!');
                }
            });
        } else {
            callback('Error in file opening!');
        }
    });
};

// Delete data oparation to file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error in removing data to file and delete file');
        }
    });
};

module.exports = lib;
