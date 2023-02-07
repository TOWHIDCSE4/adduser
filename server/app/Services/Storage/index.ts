import fs from 'fs-extra'
import path from 'path'

const saveToDisk = ({ directory, data, fileName, overwrite = false, size, type }) => {
  if (!data || !data.buffer) {
    throw new Error("invalid format: data")
  }
  if (size && data.size > size) {
    throw new Error("File must less than " + module.exports.bytesToSize(size))
  }
  if (type && !type.includes(String(getFileExtension(data.originalname)).toLowerCase())) {
    throw new Error("Only accept theses following file types " + type)
  }
  directory = path.resolve(directory)
  if (!fileName) fileName = data.originalname
  const pathFile = path.join(directory, fileName)

  if (!overwrite && fs.existsSync(pathFile)) {
    throw new Error("File exist!")
  }
  fs.ensureDirSync(directory);
  fs.writeFileSync(pathFile, data.buffer)
  return pathFile
}

const getFileExtension = (filename) => {
  return filename.split('.').pop();
}

const getNameFile = (name, extensionFile) => {
  return name + "-" + Date.now() + "." + extensionFile;
}

const removeFile = (path) => {
  if (!fs.existsSync(path)) {
    return null
  }
  fs.unlinkSync(path)
  return path
}

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) + "", 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export default {
  saveToDisk,
  getFileExtension,
  getNameFile,
  removeFile,
  bytesToSize
}
