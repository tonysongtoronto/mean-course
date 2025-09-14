const express = require("express");


const Post = require("../models/post");
const { getPostById, deleteFile, extractFilename } = require('../utils/postUtils');
const { upload } = require('../config/multerConfig');
const checkAuth = require("../middleware/check-auth");
const { now } = require("mongoose");


const router = express.Router();



router.post(
  "",
  checkAuth,
 upload.single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: (req.file && req.file?.filename) ? url + "/images/" + req.file?.filename :''
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
    checkAuth,
 upload.single("image"),
  async (req, res, next) => {
    try {
      const postId = req.params.id;

      // 1. 首先获取要更新的post信息（用于获取旧图片路径）
      const oldPost = await getPostById(postId);
      if (!oldPost) {
        return res.status(404).json({
          success: false,
          message: "Post not found!"
        });
      }

      let imagePath = req.body.imagePath;
      let shouldDeleteOldImage = false;

      // 2. 如果上传了新图片，构建新的图片路径
      if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file?.filename;
        // 标记需要删除旧图片（如果存在且与新图片不同）
        shouldDeleteOldImage = oldPost.imagePath && oldPost.imagePath !== imagePath;
      }

      const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
      });

      console.log(post);

      // 3. 更新数据库记录
      const result = await Post.updateOne({ _id: postId }, post);

      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Post not found!"
        });
      }

      // 4. 如果更新成功且需要删除旧图片，则删除旧图片文件
      if (shouldDeleteOldImage) {
        try {
          const filename = oldPost.imagePath.split("/").pop();
          await deleteFile(filename);
          console.log(`Old image ${filename} deleted successfully`);
        } catch (deleteError) {
          // 删除文件失败不影响更新操作的成功响应，只记录错误
          console.error('Delete old image error:', deleteError);
        }
      }

      console.log(`Post ${postId} updated successfully`);
      res.status(200).json({
        success: true,
        message: "Update successful!"
      });

    } catch (error) {
      console.error('Update post error:', error);

      // 如果上传了新文件但更新失败，删除新上传的文件
      if (req.file) {
        try {
          await deleteFile(req.file.filename);
        } catch (deleteError) {
          console.error('Delete uploaded file error:', deleteError);
        }
      }

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
  }
);

router.get("", async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();

    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const fetchedPosts = await postQuery;
    const count = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  }
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




module.exports = router;
