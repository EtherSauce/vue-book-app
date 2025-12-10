import gatsby from "../../public/img/gatsby.jpg";
import bird from "../../public/img/bird.jpg";
import img1984 from "../../public/img/1984.jpg";
import road from "../../public/img/road.jpg";
import hobbit from "../../public/img/hobbit.jpg";
import frank from "../../public/img/frank.jpg";
import moby from "../../public/img/moby.jpg";
import jane from "../../public/img/jane.jpg";
import pride from "../../public/img/pride.jpg";
import brave from "../../public/img/brave.jpg";
import catcher from "../../public/img/catcher.png";
import alchemist from "../../public/img/alchemist.jpg";
import dracula from "../../public/img/dracula.jpg";
import odyssey from "../../public/img/odyssey.jpg";
import wuthering from "../../public/img/wuthering.jpg";
import shining from "../../public/img/shining.jpg";
import booktheif from "../../public/img/bookthief.jpg";
import giver from "../../public/img/giver.jpg";
import fault from "../../public/img/fault.jpg";
import gonegirl from "../../public/img/gonegirl.jpg";
import martian from "../../public/img/martian.jpg";
import dragontattoo from "../../public/img/dragontattoo.jpg";
import pi from "../../public/img/pi.jpg";
import educated from "../../public/img/educated.jpg";
import sapiens from "../../public/img/sapiens.jpg";
import dune from "../../public/img/dune.jpg";
import handmaid from "../../public/img/handmaid.jpg";
import norwegian from "../../public/img/norwegian.jpg";
import atomichabits from "../../public/img/atomichabits.jpg";
import briefhistory from "../../public/img/briefhistory.jpg";
import beloved from "../../public/img/beloved.jpg";
import nightcircus from "../../public/img/nightcircus.jpg";
import natgeo from "../../public/img/natgeo.png";
import time from "../../public/img/time.jpg";
import wired from "../../public/img/wired.jpg";
import vogue from "../../public/img/vogue.jpg";
import si from "../../public/img/si.jpg";
import mentalnotes from "../../public/img/mentalnotes.jpg";

// File: src/models/inventoryData.js
export default [
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, image: "/img/gatsby.jpg", category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A classic novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.", dailyDeal: false },
        { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 8.99, image: "/img/bird.jpg", category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A powerful story of racial injustice and childhood innocence in the Deep South.", dailyDeal: false },
        { id: 3, title: "1984", author: "George Orwell", price: 15.72, image: "/img/1984.jpg", category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A dystopian novel about totalitarianism, surveillance, and the loss of individuality.", dailyDeal: false },
        { id: 4, title: "The Road", author: "Cormac McCarthy", price: 9.99, image: "/img/road.jpg", category: "Post-Apocalyptic", parentCategory: "Fiction", categories: ["Fiction","Post-Apocalyptic"], description: "A father and his young son journey on foot across the post-apocalyptic, ash-covered United States.", dailyDeal: false },
        { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", price: 19.99, image: "/img/hobbit.jpg", category: "Fantasy", parentCategory: "Fiction", categories: ["Fiction","Fantasy"], description: "A fantasy adventure following Bilbo Baggins on his quest to reclaim treasure from a dragon.", dailyDeal: false },
        { id: 6, title: "Frankenstein", author: "Mary Shelley", price: 4.99, image: "/img/frank.jpg", category: "Gothic", parentCategory: "Fiction", categories: ["Fiction","Gothic"], description: "A gothic novel about a scientist who creates a sentient creature, exploring themes of creation and responsibility.", dailyDeal: true },
        { id: 7, title: "Moby-Dick", author: "Herman Melville", price: 7.64, image: "/img/moby.jpg", category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "The epic tale of Captain Ahab’s obsessive quest to kill the white whale, Moby-Dick.", dailyDeal: false },
        { id: 8, title: "Jane Eyre", author: "Charlotte Brontë", price: 2.99, image: "/img/jane.jpg", category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A coming-of-age story about love, independence, and resilience.", dailyDeal: true },
        { id: 9, title: "Pride and Prejudice", author: "Jane Austen", price: 6.99, image: "/img/pride.jpg", category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A classic tale of love and misunderstanding in 19th-century England.", dailyDeal: false },
        { id: 10, title: "Brave New World", author: "Aldous Huxley", price: 11.50, image: "/img/brave.jpg", category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A futuristic society driven by technology and control.", dailyDeal: false },
        { id: 11, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 8.49, image: "/img/catcher.png", category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A story about teenage rebellion and alienation.", dailyDeal: false },
        { id: 12, title: "The Alchemist", author: "Paulo Coelho", price: 10.99, image: "/img/alchemist.jpg", category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "A young shepherd's journey to realize his personal legend.", dailyDeal: false },
        { id: 13, title: "Dracula", author: "Bram Stoker", price: 7.99, image: "/img/dracula.jpg", category: "Gothic", parentCategory: "Fiction", categories: ["Fiction","Gothic"], description: "The original vampire novel that started it all.", dailyDeal: false },
        { id: 14, title: "The Odyssey", author: "Homer", price: 12.00, image: "/img/odyssey.jpg", category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "An epic journey of Odysseus returning home from war.", dailyDeal: false },
        { id: 15, title: "Wuthering Heights", author: "Emily Brontë", price: 5.99, image: "/img/wuthering.jpg", category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A dark tale of passion and revenge on the Yorkshire moors.", dailyDeal: true },
        { id: 16, title: "The Shining", author: "Stephen King", price: 13.99, image: "/img/shining.jpg", category: "Horror", parentCategory: "Fiction", categories: ["Fiction","Horror"], description: "A chilling story of isolation and supernatural terror.", dailyDeal: false },
        { id: 17, title: "The Book Thief", author: "Markus Zusak", price: 9.99, image: "/img/bookthief.jpg", category: "Historical", parentCategory: "Fiction", categories: ["Fiction","Historical"], description: "A young girl's life in Nazi Germany, narrated by Death.", dailyDeal: false },
        { id: 18, title: "The Giver", author: "Lois Lowry", price: 6.50, image: "/img/giver.jpg", category: "Young Adult", parentCategory: "Children", categories: ["Children","Young Adult"], description: "A boy discovers the dark secrets behind his seemingly perfect society.", dailyDeal: true },
        { id: 19, title: "The Fault in Our Stars", author: "John Green", price: 8.99, image: "/img/fault.jpg", category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A moving love story between two teenagers with cancer.", dailyDeal: false },
        { id: 20, title: "Gone Girl", author: "Gillian Flynn", price: 10.50, image: "/img/gonegirl.jpg", category: "Mystery", parentCategory: "Fiction", categories: ["Fiction","Mystery"], description: "A psychological thriller about a marriage gone wrong.", dailyDeal: false },
        { id: 21, title: "The Martian", author: "Andy Weir", price: 12.99, image: "/img/martian.jpg", category: "Science Fiction", parentCategory: "Fiction", categories: ["Fiction","Science Fiction"], description: "An astronaut's struggle to survive on Mars.", dailyDeal: false },
        { id: 22, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", price: 9.49, image: "/img/dragontattoo.jpg", category: "Mystery", parentCategory: "Fiction", categories: ["Fiction","Mystery"], description: "A gripping mystery involving a journalist and a hacker.", dailyDeal: false },
        { id: 23, title: "Life of Pi", author: "Yann Martel", price: 7.99, image: "/img/pi.jpg", category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "A boy's survival story with a Bengal tiger on a lifeboat.", dailyDeal: false },
        { id: 24, title: "Educated", author: "Tara Westover", price: 14.99, image: "/img/educated.jpg", category: "Non-Fiction", parentCategory: "Non-Fiction", categories: ["Non-Fiction"], description: "A memoir about growing up in a strict and abusive household in rural Idaho.", dailyDeal: false },
        { id: 25, title: "Sapiens", author: "Yuval Noah Harari", price: 16.99, image: "/img/sapiens.jpg", category: "History", parentCategory: "Non-Fiction", categories: ["Non-Fiction","History"], description: "A brief history of humankind, exploring how Homo sapiens came to dominate the planet.", dailyDeal: false },
        { id: 26, title: "Dune", author: "Frank Herbert", price: 14.50, image: "/img/dune.jpg", category: "Science Fiction", parentCategory: "Fiction", categories: ["Fiction","Science Fiction"], description: "Epic science fiction about politics, religion, and the desert planet Arrakis.", dailyDeal: false },
        { id: 27, title: "The Handmaid's Tale", author: "Margaret Atwood", price: 11.99, image: "/img/handmaid.jpg", category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A chilling vision of a totalitarian future controlling women's bodies and rights.", dailyDeal: false },
        { id: 28, title: "Norwegian Wood", author: "Haruki Murakami", price: 9.49, image: "/img/norwegian.jpg", category: "Literary", parentCategory: "Fiction", categories: ["Fiction","Literary"], description: "A deeply moving coming-of-age novel about love and loss.", dailyDeal: false },
        { id: 29, title: "Atomic Habits", author: "James Clear", price: 13.99, image: "/img/atomichabits.jpg", category: "Self-Help", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Self-Help"], description: "Practical strategies to form good habits, break bad ones, and master tiny behaviors.", dailyDeal: true },
        { id: 30, title: "A Brief History of Time", author: "Stephen Hawking", price: 15.00, image: "/img/briefhistory.jpg", category: "Science", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Science"], description: "Accessible introduction to cosmology, black holes, and the nature of the universe.", dailyDeal: false },
        { id: 31, title: "Beloved", author: "Toni Morrison", price: 10.99, image: "/img/beloved.jpg", category: "Historical", parentCategory: "Fiction", categories: ["Fiction","Historical"], description: "A haunting novel about slavery's legacy and a mother's love.", dailyDeal: false },
        { id: 32, title: "The Night Circus", author: "Erin Morgenstern", price: 12.49, image: "/img/nightcircus.jpg", category: "Fantasy", parentCategory: "Fiction", categories: ["Fiction","Fantasy"], description: "A magical competition between two young illusionists set inside a mysterious traveling circus.", dailyDeal: false },
        { id: 33, title: "National Geographic — April 2024", author: "National Geographic", price: 6.99, image: "/img/natgeo.png", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Science"], description: "Features on nature, science, and world cultures with stunning photography.", dailyDeal: false },
        { id: 34, title: "TIME — Special Edition", author: "TIME", price: 5.99, image: "/img/time.jpg", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","News"], description: "In-depth reporting and analysis of current events and global trends.", dailyDeal: false },
        { id: 35, title: "Wired — Tech Issue", author: "Wired", price: 7.50, image: "/img/wired.jpg", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Technology"], description: "Coverage of technology, innovation, and the digital future.", dailyDeal: false },
        { id: 36, title: "Vogue — Fashion", author: "Vogue", price: 4.99, image: "/img/vogue.jpg", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Lifestyle"], description: "Fashion, beauty, and culture from top designers and photographers.", dailyDeal: false },
        { id: 37, title: "Sports Illustrated — Collector's Issue", author: "Sports Illustrated", price: 5.99, image: "/img/si.jpg", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Sports"], description: "Highlights and long-form stories from the world of sports.", dailyDeal: false },
        { id: 38, title: "Mental Notes Magazine", author: "Mental Notes Inc.", price: 3.99, image: "/img/mentalnotes.jpg", category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Education"], description: "Ideas and exercises for improving study habits, UX thinking, and productivity.", dailyDeal: true }
];
