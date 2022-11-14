const bookModel = require('../model/book_model');

exports.getBooks = async(req,res) => {
    const bookList = await bookModel.find();
    res.status(200).json( {
        statusCode: 200,
        statusMessage: 'Books list',
        data: bookList
    });
}


exports.getBookById = async(req,res) => { 
    const {id} = req.params;
    const book = await bookModel.findOne({isbn: id});
    if(book==null) {
       return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Book not found"
       });
    } 
    res.status(200).json( {
        statusCode: 200,
        statusMessage: "Book found",
        data: book
    });
}


exports.bookUpload = async(req,res) => {
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;

    const bookExist = await bookModel.findOne({isbn: isbn});

    if(bookExist) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Book already exists"
        });
    }

    const data = await bookModel.create({title, isbn, author});
    data.save();

    res.status(200).json( {
        statusCode: 200,
        statusMessage: "Book uploaded",
        data: data
    });
}


exports.bookUpdate = async(req,res) => {
    const { isbn } = req.params;
    const {title, author} = req.body;

    const bookExist = await bookModel.findOne({isbn : isbn});
    if(!bookExist) {
        return res.status(400).json( {
            statusCode: 400,
            statusMessage: "Book does not exist!!"
        });
    }

    const updateField = (val,prev) => !val ?prev :val;

    const updatedBook = {
        title: updateField(title, bookExist.title),
        author: updateField(author, bookExist.author)
    };

    await bookModel.updateOne({
        isbn : isbn,
        $set : {
            title: updatedBook.title,
            author: updatedBook.author
        }
    });

    res.status(200).json( {
        statusCode: 200,
        statusMessage: 'Book details updated',
        data: updatedBook
    });
}


exports.bookDelete = async(req,res) => {
    const { id } = req.params;

    const bookExist = await bookModel.findOne({isbn: id});
    if(!bookExist) {
        return res.status(400).json({
            statusCode: 400,
            statusMessage: 'Book does not exist!!'
        });
    }

    await bookModel.deleteOne({isbn: id}).then(() => {

        res.status(200).json( {
            statusCode: 200,
            statusMessage: 'Book record deleted',
            data : bookExist
        });

    }).catch((error) => {
        console.log(error);
    });
}