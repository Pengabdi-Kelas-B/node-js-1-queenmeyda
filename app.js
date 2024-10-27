const fs = require("node:fs");
const readline = require("node:readline");
const path = require("node:path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// contoh script pembuatan folder
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    fs.mkdir(__dirname + `/${folderName}`, () => {
      console.log("success created new folder");
    });
    rl.close();
  });
};

// To Do : lanjutkan pembuatan logic disini
// make-file: Membuat file baru dengan nama dan ekstensi
app.makeFile = () => {
  rl.question("Masukan Nama File: ", (fileName) => {
    fs.writeFile(path.join(__dirname, fileName), "", (err) => {
      if (err) {
        console.error("Gagal membuat file:", err);
      } else {
        console.log("Berhasil membuat file:", fileName);
      }
      rl.close();
    });
  });
};

// ext-sorter: Mengatur file ke dalam folder berdasarkan ekstensi
app.extSorter = () => {
  const sourceFolder = path.join(__dirname, "unorganize_folder");
  fs.readdir(sourceFolder, (err, files) => {
    if (err) {
      console.error("Gagal membaca folder:", err);
      return;
    }
    files.forEach((file) => {
      const ext = path.extname(file).slice(1);
      const targetFolder = path.join(__dirname, ext);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
      }
      fs.rename(
        path.join(sourceFolder, file),
        path.join(targetFolder, file),
        (err) => {
          if (err) console.error(`Gagal memindahkan file ${file}:`, err);
          else console.log(`File ${file} dipindahkan ke folder ${ext}`);
        }
      );
    });
  });
};

// read-folder: Membaca dan menampilkan isi folder
app.readFolder = () => {
  rl.question("Masukan Nama Folder: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error("Gagal membaca folder:", err);
        rl.close();
        return;
      }
      const fileDetails = files.map((file) => {
        const filePath = path.join(folderPath, file.name);
        const stats = fs.statSync(filePath);
        return {
          namaFile: file.name,
          ekstensi: path.extname(file.name).slice(1),
          jenisFile: file.isDirectory() ? "folder" : "file",
          tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
          ukuranFile: `${(stats.size / 1024).toFixed(1)}kb`,
        };
      });
      console.log(
        `Isi dari folder ${folderName}:\n`,
        JSON.stringify(fileDetails, null, 2)
      );
      rl.close();
    });
  });
};

// read-file: Membaca isi file teks
app.readFile = () => {
  rl.question("Masukkan Path File (ex: home/home.txt): ", (filePath) => {
    const fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) {
        console.error("Gagal membaca file:", err);
      } else {
        console.log(`Isi dari file ${filePath}:\n`, data);
      }
      rl.close();
    });
  });
};

module.exports = app;
