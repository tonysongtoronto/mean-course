const express = require("express");
const PostController = require("../controllers/posts");

const Post = require("../models/post");

const { upload } = require('../config/multerConfig');
const checkAuth = require("../middleware/check-auth");



const router = express.Router();



router.post(
  "",
  checkAuth,
  upload.single("image"),
PostController.createPost
);



router.put(
  "/:id",
  checkAuth,
  upload.single("image"),
  PostController.updatePost

);

router.get("", PostController.getPosts);


router.get("/:id", PostController.getPost
);





// 删除Post的路由处理
router.delete("/:id",  checkAuth, PostController.deletePost );




module.exports = router;
