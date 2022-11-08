const router = require('express').Router();
const bookModel = require('../model/book_model');

router.get('/books', async (req,res) =>  {
    const bookList = await bookModel.find();
    console.log(bookList);
    res.send(bookList);
});


router.get('/books/:id', async (req,res) => {
    const {id} = req.params;
    const book = await bookModel.findOne({isbn: id});
    if(book==null) {
       return res.send("Book not found");
    } 
    res.send(book);
});

router.post('/books', async (req,res) => {
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;

    const bookExist = await bookModel.findOne({isbn: isbn});

    if(bookExist) {
        return res.send("Book already exists");
    }

    const data = await bookModel.create({title, isbn, author});
    data.save();

    res.send("Book Uploaded");

});

router.put('/books/:id', async(req,res) => {
    const { id } = req.params;
    const {title, author} = req.body;

    const bookExist = await bookModel.findOne({isbn : id});
    if(!bookExist) {
        return res.send("Book does not exist");
    }

    const updateField = (val,prev) => !val ?prev :val;

    const updatedBook = {
        title: updateField(title, bookExist.title),
        author: updateField(author, bookExist.author)
    };

    await bookModel.updateOne({
        isbn : id,
        $set : {
            title: updatedBook.title,
            author: updatedBook.author
        }
    });

    res.status(200).send("Book Updated!!");
    
});

router.delete('/books/:id', async(req,res) => {
    const { id } = req.params;

    const bookExist = await bookModel.findOne({isbn: id});
    if(!bookExist) {
        return res.send("Book does not exist");
    }

    await bookModel.deleteOne({isbn: id}).then(() => {
        console.log("Product deleted");
        res.send("Book record deleted!!");
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = router;

