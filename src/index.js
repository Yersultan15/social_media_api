
const express = require("express");
const path = require("path");
const session = require("express-session");
const collection = require("./config");
const axios = require('axios');
const InstagramQuery = require('./instagram');
const bcrypt = require("bcrypt");
const app = express();
const Quiz = require('./quiz');
const Item = require('./item');
const TikTok = require('./tiktok');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const i18n = require("i18n");


const rapid_api_key='26beb044cbmshe1f334dd6a4877dp18eda9jsn9c9e1e0bdeb6'



// convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.join(process.cwd(), 'views'));
// Static file
app.use(express.static(path.join(__dirname, '../public/')));
const templatePath = path.join(__dirname, '../views');

const publicPath = path.join(__dirname, '../public');
app.set("view engine", "ejs");
app.set('views', templatePath);
app.use(session({
    secret: "shymkent",
    resave: false,
    saveUninitialized: true
}));
app.use('/uploads', express.static('uploads'));

i18n.configure({
    locales: ['en', 'ru', 'kz'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    cookie: 'yourcookiename',
    objectNotation: true,
});
app.use(i18n.init);


const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/");
    }
};
app.get("/", (req, res) => {
    res.render("login");
});
app.get('/itemsList', isLoggedIn, async (req, res) => {
    try {
        const items = await Item.find();
        // Render the "itemList" view and pass the items data to it
        res.render('itemsList', { items, req: req });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/items', isLoggedIn, async (req, res) => {
    try {
        if (req.session.user && req.session.user.isAdmin) {
            const items = await Item.find();
            res.render('items', { items, req: req });
        } else {
            res.redirect("/instagram");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.js
app.get('/items/edit/:itemId', isLoggedIn, async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.render('editItem', { item, req: req });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.js
app.get('/items/delete/:itemId', isLoggedIn, async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.redirect('/itemsList');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// items.ejs
app.post('/items', upload.array('itemImage', 3), async (req, res) => {
    try {
        const newItem = new Item({
            name: {
                en: req.body.name,
            },
            description: {
                en: req.body.description,
            },
            images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [], // Save the file paths in the database
        });

        await newItem.save();

        console.log('Data received from the form:', req.body);

        res.redirect('/itemsList');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// app.js
app.post('/items/:itemId', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.itemId,
            {
                $set: {
                    name: { en: req.body.name },
                    description: { en: req.body.description },
                },
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.redirect('/itemsList');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/items/:itemId', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.itemId,
            { $set: req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json(updatedItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/items/:itemId', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json({ message: 'Item deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get("/signup", (req, res) => {
    res.render("signup",{req: req });
});

app.get("/instagram", isLoggedIn, (req, res) => {
    res.render("instagram",{ req: req });
});
app.get("/quiz/start", isLoggedIn, (req, res) => {


    res.render("quiz_start", { req: req });
});
app.post('/add-question', async (req, res) => {
    try {
        const { question, options, correctAnswer, category, difficultyLevel } = req.body;

        const newQuestion = new Quiz({
            question,
            options,
            correctAnswer,
            category,
            difficultyLevel,
        });

        await newQuestion.save();

        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/get-questions', async (req, res) => {
    try {
        const questions = await Quiz.find();
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get("/tiktok", isLoggedIn, (req, res) => {
    res.render("tiktok", { req: req });
});
app.post("/download-tiktok-video", async (req, res) => {
    const videoLink = req.body['tiktok-video-link'];

    const options = {
        method: 'POST',
        url: 'https://tikwatermark.p.rapidapi.com/video_without_watermark',
        params: {
            video_link: videoLink,
            is_share_link: 'true'
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '1a3a512480msh378d3c082a3a83dp1d9e96jsne320ff037b16',
            'X-RapidAPI-Host': 'tikwatermark.p.rapidapi.com'
        },
    };

    try {
        const response = await axios.request(options);

        // Create TikTok Collection
        const tikTokData = new TikTok({
            timestamp: new Date().toLocaleString(),
            videoLink: videoLink,
        });

        tikTokData.save()
            .then(() => {
                console.log('TikTok data saved successfully');
            })
            .catch((error) => {
                console.error('Error saving TikTok data:', error);
            });

        res.render("tiktok", { req: req, tikTokVideoInfo: response.data });
    } catch (error) {
        console.error("Error fetching TikTok video data:", error);

        res.status(500).send("Internal Server Error");
    }
});



app.post("/signup", async (req, res) => {
    console.log("Signup route hit");
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = (username.toLowerCase() === 'ersik');

    const existingUser = await collection.findOne({ name: username });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new collection({
                userID: generateUserID(),
                name: username,
                password: hashedPassword,
                isAdmin: isAdmin
            });

            await newUser.save();

            req.session.user = {
                name: newUser.name,
                isAdmin: newUser.isAdmin
            };

            res.redirect("/instagram");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
});

app.post('/quiz/submit', async (req, res) => {
    try {
        const userId = req.session.user.userID;
        const quizId = req.body.quizId;
        const selectedAnswer = req.body.selectedAnswer;

        const userResponse = new UserResponse({
            userId,
            quizId,
            selectedAnswer,
        });

        await userResponse.save();


        res.render('quiz_start', { req: req });
    } catch (error) {
        console.error('Error processing quiz submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/quiz_start', (req, res) => {
    // Handle the form submission data here
    const quizAnswers = req.body;

    // For demonstration purposes, let's assume the correct answers
    const correctAnswers = {
        question1: '2010',
        question2: 'Adam Mosseri',
        question3: '1 billion',
        question4: 'Facebook',
        question5: 'Instagram Stories',
    };

    // Calculate the quiz score based on the selected answers
    let score = 0;
    Object.keys(correctAnswers).forEach(question => {
        if (quizAnswers[question] === correctAnswers[question]) {
            score++;
        }
    });

    // Calculate the time taken
    const timeTakenInSeconds = 300 - req.body.timer; // Assuming the timer value is sent in the request

    // For demonstration purposes, let's assume the result is a simple object
    const quizResult = {
        score: score,
        totalQuestions: Object.keys(correctAnswers).length,
        feedback: `Good job! You scored ${score} out of ${Object.keys(correctAnswers).length}.`,
        timeTaken: {
            minutes: Math.floor(timeTakenInSeconds / 60),
            seconds: timeTakenInSeconds % 60,
        },
        // Add more properties as needed
    };

    // Render the quiz_start.ejs view with the quiz result
    res.render('quiz_start', { quizResult, req:req});
});

// Login user
app.post("/login", async (req, res) => {
    console.log("Login route hit");
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot be found");
        } else {
            // Compare hashed password
            const passwordMatch = await bcrypt.compare(req.body.password, check.password);

            if (passwordMatch) {
                // Set the user information in the session
                req.session.user = {
                    name: check.name,
                    isAdmin: check.isAdmin
                };

                // Redirect based on admin status
                if (check.isAdmin) {
                    res.redirect("/admin");
                } else {
                    res.redirect("/instagram");
                }
            } else {
                res.send("Wrong Password");
            }
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong Details");
    }
});
// Inside the /admin route
app.get("/admin", async (req, res) => {
    // Check if the user is logged in and has admin privileges
    if (req.session.user && req.session.user.isAdmin) {
        // If the user is an admin, fetch all users and render the admin view
        const users = await collection.find();
        res.render("admin", { users, req: req, adminName: req.session.user.name });
    } else {
        // If the user is not logged in or not an admin, redirect to the login page
        res.redirect("/");
    }
});
// Add user route
// Add user route
app.post("/admin/add", async (req, res) => {
    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;
    const isAdmin = req.body.isAdmin === 'on';

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Create a new document to be inserted
        const newUser = new collection({
            userID: generateUserID(),
            name: newUsername,
            password: hashedPassword,
            isAdmin: isAdmin
        });

        // Save the new user to the database
        await newUser.save();

        // Redirect back to the admin panel
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// Edit user route
app.get("/admin/edit/:userId", async (req, res) => {
    const userId = req.params.userId;

    // Fetch the user from the database based on the user ID
    const user = await collection.findOne({ userID: userId });

    // Render an edit form with the user data
    res.render("edit", { user });
});

// Delete user route
// Delete user route
app.post("/admin/delete/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Delete the user from the database based on the user ID
        await collection.deleteOne({ userID: userId });

        // Redirect back to the admin panel
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Edit user route
app.post("/admin/edit/:userId", async (req, res) => {
    const userId = req.params.userId;
    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;
    const isAdmin = req.body.isAdmin === 'on';

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user in the database based on the user ID
        await collection.findOneAndUpdate({ userID: userId }, {
            $set: {
                name: newUsername,
                password: hashedPassword,
                isAdmin: isAdmin
            }
        });

        // Redirect back to the admin panel
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/admin/update/:userId", async (req, res) => {
    const userId = req.params.userId;
    const newUsername = req.body.newUsername;
    const newPassword = req.body.newPassword;
    const isAdmin = req.body.isAdmin === 'on';

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await collection.findOneAndUpdate({ userID: userId }, {
            $set: {
                name: newUsername,
                password: hashedPassword,
                isAdmin: isAdmin
            }
        });

        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



function generateUserID() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `user_${timestamp}_${random}`;
}
// Route to render history page
app.get("/history", isLoggedIn, async (req, res) => {
    try {
        const instagramQueryHistory = await InstagramQuery.find();

        const tikTokQueryHistory = await TikTok.find();

        res.render("history", { req, instagramQueryHistory, tikTokQueryHistory });
    } catch (error) {
        console.error("Error fetching history:", error);

        res.status(500).send("Internal Server Error");
    }
});
app.get("/history2", isLoggedIn, async (req, res) => {
    try {
        const instagramQueryHistory = await InstagramQuery.find();

        const tikTokQueryHistory = await TikTok.find();

        res.render("history2", { req, instagramQueryHistory, tikTokQueryHistory });
    } catch (error) {
        console.error("Error fetching history:", error);

        res.status(500).send("Internal Server Error");
    }
});





const instagramQueryHistory = [];
app.post("/get-instagram-info", async (req, res) => {
    const username = req.body['instagram-username'];

    const options = {
        method: 'GET',
        url: 'https://robigram.p.rapidapi.com/api/insta/andr/userinfo',
        params: {
            username: username
        },
        headers: {
            'X-RapidAPI-Key': '1a3a512480msh378d3c082a3a83dp1d9e96jsne320ff037b16',
            'X-RapidAPI-Host': 'robigram.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);

        const queryResult = new InstagramQuery({
            timestamp: new Date().toLocaleString(),
            userID: response.data.id,
            username: response.data.username,
            isPrivate: response.data.is_private,
            fullName: response.data.full_name,
        });

        await queryResult.save();

        res.render("instagram", { req: req, instagramUserInfo: response.data });
    } catch (error) {
        console.error("Error fetching Instagram data:", error);

        res.status(500).send("Internal Server Error");
    }
});


// Define Port for Application
const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});