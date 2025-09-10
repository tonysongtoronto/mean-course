// utils/postUtils.js
const path = require('path');
const fs = require('fs').promises;
const Post = require('../models/post'); // 根据你的Post模型路径调整

/**
 * 根据ID获取Post
 * @param {string} id - Post的ID
 * @returns {Promise<Object>} Post对象
 * @throws {Error} 如果Post不存在
 */
async function getPostById(id) {
  try {
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found!");
    }
    return post;
  } catch (error) {
    throw error;
  }
}

/**
 * 删除指定文件
 * @param {string} filename - 要删除的文件名
 * @param {string} folder - 文件所在文件夹，默认为'images'
 */
async function deleteFile(filename, folder = 'images') {
  try {
    const filePath = path.join(__dirname, `../${folder}`, filename);
    await fs.unlink(filePath);
    console.log(`File ${filename} deleted successfully`);
  } catch (err) {
    // 如果文件不存在，不需要抛出错误
    if (err.code === 'ENOENT') {
      console.log(`File ${filename} does not exist, skipping deletion`);
    } else {
      console.error('Failed to delete file:', err);
      // 不抛出错误，避免影响主流程
    }
  }
}

/**
 * 从图片路径中提取文件名
 * @param {string} imagePath - 图片路径
 * @returns {string} 文件名
 */
function extractFilename(imagePath) {
  if (!imagePath) return null;
  return imagePath.split("/").pop();
}

module.exports = {
  getPostById,
  deleteFile,
  extractFilename
};
