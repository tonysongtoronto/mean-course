const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const { getPostById, deleteFile, extractFilename } = require('../utils/postUtils');




const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file?.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file?.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});





// 删除Post的路由处理
router.delete("/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;

    // 1. 首先获取要删除的post信息（用于获取图片路径）
    const post = await getPostById(postId);

    // 2. 删除数据库中的记录
    const result = await Post.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    }

    // 3. 如果post有关联的图片文件，则删除文件
    if (post && post.imagePath) {
      const filename = post.imagePath.split("/").pop();
      await deleteFile(filename);
    }

    console.log(`Post ${postId} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully!"
    });

  } catch (error) {
    console.error('Delete post error:', error);

    // 根据错误类型返回不同的状态码
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format!"
      });
    }

    if (error.message === "Post not found!") {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;

    // 1. 首先获取要删除的post信息（用于获取图片路径）
    const post = await getPostById(postId);

    // 2. 删除数据库中的记录
    const result = await Post.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    }

    // 3. 如果post有关联的图片文件，则删除文件
    if (post && post.imagePath) {
      const filename = extractFilename(post.imagePath);
      if (filename) {
        await deleteFile(filename);
      }
    }

    console.log(`Post ${postId} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully!"
    });

  } catch (error) {
    console.error('Delete post error:', error);

    // 根据错误类型返回不同的状态码
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format!"
      });
    }

    if (error.message === "Post not found!") {
      return res.status(404).json({
        success: false,
        message: "Post not found!"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


module.exports = router;
