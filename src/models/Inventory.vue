<script>
import Book from './Book.vue';

import img1984 from "@/img/1984.jpg"
import alchemist from "@/img/alchemist.jpg"
import atomichabits from "@/img/atomichabits.jpg"
import beloved from "@/img/beloved.jpg"
import bird from "@/img/bird.jpg"
import booktheif from "@/img/bookthief.jpg"
import brave from "@/img/brave.jpg"
import briefhistory from "@/img/briefhistory.jpg"
import catcher from "@/img/catcher.png"
import dracula from "@/img/dracula.jpg"
import dune from "@/img/dune.jpg"
import dragontattoo from "@/img/dragontattoo.jpg"
import educated from "@/img/educated.jpg"
import fault from "@/img/fault.jpg"
import frank from "@/img/frank.jpg"
import giver from "@/img/giver.jpg"
import gatsby from "@/img/gatsby.jpg"
import gonegirl from "@/img/gonegirl.jpg"
import handmaid from "@/img/handmaid.jpg"
import hobbit from "@/img/hobbit.jpg"
import jane from "@/img/jane.jpg"
import martian from "@/img/martian.jpg"
import mentalnotes from "@/img/mentalnotes.jpg"
import moby from "@/img/moby.jpg"
import nightcircus from "@/img/nightcircus.jpg"
import norwegian from "@/img/norwegian.jpg"
import natgeo from "@/img/natgeo.png"
import odyssey from "@/img/odyssey.jpg"
import pi from "@/img/pi.jpg"
import pride from "@/img/pride.jpg"
import road from "@/img/road.jpg"
import sapiens from "@/img/sapiens.jpg"
import shining from "@/img/shining.jpg"
import si from "@/img/si.jpg"
import time from "@/img/time.jpg"
import vogue from "@/img/vogue.jpg"
import wuthering from "@/img/wuthering.jpg"
import wired from "@/img/wired.jpg"

export function createInventory() {
  const raw = [
    {id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, image: gatsby, category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A classic novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.", dailyDeal: false},
    {id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 8.99, image: bird, category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A powerful story of racial injustice and childhood innocence in the Deep South.", dailyDeal: false},
    {id: 3, title: "1984", author: "George Orwell", price: 15.72, image: img1984, category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A dystopian novel about totalitarianism, surveillance, and the loss of individuality.", dailyDeal: false},
    {id: 4, title: "The Road", author: "Cormac McCarthy", price: 9.99, image: road, category: "Post-Apocalyptic", parentCategory: "Fiction", categories: ["Fiction","Post-Apocalyptic"], description: "A father and his young son journey on foot across the post-apocalyptic, ash-covered United States.", dailyDeal: false},
    {id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", price: 19.99, image: hobbit, category: "Fantasy", parentCategory: "Fiction", categories: ["Fiction","Fantasy"], description: "A fantasy adventure following Bilbo Baggins on his quest to reclaim treasure from a dragon.", dailyDeal: false},
    {id: 6, title: "Frankenstein", author: "Mary Shelley", price: 4.99, image: frank, category: "Gothic", parentCategory: "Fiction", categories: ["Fiction","Gothic"], description: "A gothic novel about a scientist who creates a sentient creature, exploring themes of creation and responsibility.", dailyDeal: true},
    {id: 7, title: "Moby-Dick", author: "Herman Melville", price: 7.64, image: moby, category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "The epic tale of Captain Ahab’s obsessive quest to kill the white whale, Moby-Dick.", dailyDeal: false},
    {id: 8, title: "Jane Eyre", author: "Charlotte Brontë", price: 2.99, image: jane, category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A coming-of-age story about love, independence, and resilience.", dailyDeal: true},
    {id: 9, title: "Pride and Prejudice", author: "Jane Austen", price: 6.99, image: pride, category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A classic tale of love and misunderstanding in 19th-century England.", dailyDeal: false},
    {id: 10, title: "Brave New World", author: "Aldous Huxley", price: 11.50, image: brave, category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A futuristic society driven by technology and control.", dailyDeal: false},
    {id: 11, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 8.49, image: catcher, category: "Fiction", parentCategory: "Fiction", categories: ["Fiction"], description: "A story about teenage rebellion and alienation.", dailyDeal: false},
    {id: 12, title: "The Alchemist", author: "Paulo Coelho", price: 10.99, image: alchemist, category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "A young shepherd's journey to realize his personal legend.", dailyDeal: false},
    {id: 13, title: "Dracula", author: "Bram Stoker", price: 7.99, image: dracula, category: "Gothic", parentCategory: "Fiction", categories: ["Fiction","Gothic"], description: "The original vampire novel that started it all.", dailyDeal: false},
    {id: 14, title: "The Odyssey", author: "Homer", price: 12.00, image: odyssey, category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "An epic journey of Odysseus returning home from war.", dailyDeal: false},
    {id: 15, title: "Wuthering Heights", author: "Emily Brontë", price: 5.99, image: wuthering, category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A dark tale of passion and revenge on the Yorkshire moors.", dailyDeal: true},
    {id: 16, title: "The Shining", author: "Stephen King", price: 13.99, image: shining, category: "Horror", parentCategory: "Fiction", categories: ["Fiction","Horror"], description: "A chilling story of isolation and supernatural terror.", dailyDeal: false},
    {id: 17, title: "The Book Thief", author: "Markus Zusak", price: 9.99, image: booktheif, category: "Historical", parentCategory: "Fiction", categories: ["Fiction","Historical"], description: "A young girl's life in Nazi Germany, narrated by Death.", dailyDeal: false},
    {id: 18, title: "The Giver", author: "Lois Lowry", price: 6.50, image: giver, category: "Young Adult", parentCategory: "Children", categories: ["Children","Young Adult"], description: "A boy discovers the dark secrets behind his seemingly perfect society.", dailyDeal: true},
    {id: 19, title: "The Fault in Our Stars", author: "John Green", price: 8.99, image: fault, category: "Romance", parentCategory: "Fiction", categories: ["Fiction","Romance"], description: "A moving love story between two teenagers with cancer.", dailyDeal: false},
    {id: 20, title: "Gone Girl", author: "Gillian Flynn", price: 10.50, image: gonegirl, category: "Mystery", parentCategory: "Fiction", categories: ["Fiction","Mystery"], description: "A psychological thriller about a marriage gone wrong.", dailyDeal: false},
    {id: 21, title: "The Martian", author: "Andy Weir", price: 12.99, image: martian, category: "Science Fiction", parentCategory: "Fiction", categories: ["Fiction","Science Fiction"], description: "An astronaut's struggle to survive on Mars.", dailyDeal: false},
    {id: 22, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", price: 9.49, image: dragontattoo, category: "Mystery", parentCategory: "Fiction", categories: ["Fiction","Mystery"], description: "A gripping mystery involving a journalist and a hacker.", dailyDeal: false},
    {id: 23, title: "Life of Pi", author: "Yann Martel", price: 7.99, image: pi, category: "Adventure", parentCategory: "Fiction", categories: ["Fiction","Adventure"], description: "A boy's survival story with a Bengal tiger on a lifeboat.", dailyDeal: false},
    {id: 24, title: "Educated", author: "Tara Westover", price: 14.99, image: educated, category: "Non-Fiction", parentCategory: "Non-Fiction", categories: ["Non-Fiction"], description: "A memoir about growing up in a strict and abusive household in rural Idaho.", dailyDeal: false},
    {id: 25, title: "Sapiens", author: "Yuval Noah Harari", price: 16.99, image: sapiens, category: "History", parentCategory: "Non-Fiction", categories: ["Non-Fiction","History"], description: "A brief history of humankind, exploring how Homo sapiens came to dominate the planet.", dailyDeal: false },
    {id: 26, title: "Dune", author: "Frank Herbert", price: 14.50, image: dune, category: "Science Fiction", parentCategory: "Fiction", categories: ["Fiction","Science Fiction"], description: "Epic science fiction about politics, religion, and the desert planet Arrakis.", dailyDeal: false },
    {id: 27, title: "The Handmaid's Tale", author: "Margaret Atwood", price: 11.99, image: handmaid, category: "Dystopian", parentCategory: "Fiction", categories: ["Fiction","Dystopian"], description: "A chilling vision of a totalitarian future controlling women's bodies and rights.", dailyDeal: false },
    {id: 28, title: "Norwegian Wood", author: "Haruki Murakami", price: 9.49, image: norwegian, category: "Literary", parentCategory: "Fiction", categories: ["Fiction","Literary"], description: "A deeply moving coming-of-age novel about love and loss.", dailyDeal: false },
    {id: 29, title: "Atomic Habits", author: "James Clear", price: 13.99, image: atomichabits, category: "Self-Help", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Self-Help"], description: "Practical strategies to form good habits, break bad ones, and master tiny behaviors.", dailyDeal: true },
    {id: 30, title: "A Brief History of Time", author: "Stephen Hawking", price: 15.00, image: briefhistory, category: "Science", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Science"], description: "Accessible introduction to cosmology, black holes, and the nature of the universe.", dailyDeal: false },
    {id: 31, title: "Beloved", author: "Toni Morrison", price: 10.99, image: beloved, category: "Historical", parentCategory: "Fiction", categories: ["Fiction","Historical"], description: "A haunting novel about slavery's legacy and a mother's love.", dailyDeal: false },
    {id: 32, title: "The Night Circus", author: "Erin Morgenstern", price: 12.49, image: nightcircus, category: "Fantasy", parentCategory: "Fiction", categories: ["Fiction","Fantasy"], description: "A magical competition between two young illusionists set inside a mysterious traveling circus.", dailyDeal: false },
    { id: 33, title: "National Geographic — April 2024", author: "National Geographic", price: 6.99, image: natgeo, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Science"], description: "Features on nature, science, and world cultures with stunning photography.", dailyDeal: false },
    { id: 34, title: "TIME — Special Edition", author: "TIME", price: 5.99, image: time, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","News"], description: "In-depth reporting and analysis of current events and global trends.", dailyDeal: false },
    { id: 35, title: "Wired — Tech Issue", author: "Wired", price: 7.50, image: wired, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Technology"], description: "Coverage of technology, innovation, and the digital future.", dailyDeal: false },
    { id: 36, title: "Vogue — Fashion", author: "Vogue", price: 4.99, image: vogue, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Lifestyle"], description: "Fashion, beauty, and culture from top designers and photographers.", dailyDeal: false },
    { id: 37, title: "Sports Illustrated — Collector's Issue", author: "Sports Illustrated", price: 5.99, image: si, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Sports"], description: "Highlights and long-form stories from the world of sports.", dailyDeal: false },
    { id: 38, title: "Mental Notes Magazine", author: "Mental Notes Inc.", price: 3.99, image: mentalnotes, category: "Magazines", parentCategory: "Non-Fiction", categories: ["Non-Fiction","Magazines","Education"], description: "Ideas and exercises for improving study habits, UX thinking, and productivity.", dailyDeal: true }
  ];

  return raw.map(r => new Book(r).toPlain());
}

export default { createInventory };
</script>
