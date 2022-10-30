/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');// untuk import nanoid dari package-nya.
const notes = require('./notes');// impor array notes pada berkas handler.js

const addNoteHandler = (request, h) => { // h  hapi
  const { title, tags, body } = request.payload; //  cara mendapatkan body request di Hapi? Yap! Menggunakan properti request.payload
  const id = nanoid(16);// id merupakan string yg unik makan menggunkan library pihak ke 3  naniud().
  const createdAt = new Date().toISOString();// menjadi string
  const updateAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updateAt,
  };
  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// membuat fungsi handler untuk get di id routes
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.request({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(400);
  return response;
};
// mengubah catatan
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };
    const response = h.response({
      status: 'succes',
      message: ' Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// menghapus catatan
const deleteNoteByIdhHndler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);
  // untuk menghapus data pada array di index menggunakan method array splice()
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(505);
    return response;
  }
  // ila index bernilai -1, maka kembalikan handler dengan respons gagal.
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdhHndler,
};
