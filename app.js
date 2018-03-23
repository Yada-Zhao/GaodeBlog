var bodyParer = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();
    
// SET
mongoose.connect("mongodb://localhost/gaode_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParer.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongosee model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//Routes
app.get("/",function(req,res){
    res.redirect("blogs");
});

// Index Routes
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error!");
        }else{
            res.render("index",{blogs:blogs}); // send database data to index.ejs
        }
    });
});

// New Route
app.get("/blogs/new", function(req,res){
    res.render("new");
})

//create Route
app.post("/blogs", function(req,res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.redirect("/new")
        }else{
            res.redirect("/blogs")
        }
    })
})
//Show Route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error!")
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
})
// Edit Route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log("error");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
})
// Update Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/"+req.params.id);
      }
  })
})
// Delete Route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Delete went wrong!")
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});

//final
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!")
})




