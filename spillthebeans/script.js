document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        start: document.getElementById('start-screen'),
        question: document.getElementById('question-screen'),
        results: document.getElementById('results-screen')
    };
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const coffeeRecommendationElement = document.getElementById('coffee-recommendation');

    // --- COFFEE DECISION TREE ---
    // Using descriptive keys for readability in the tree
    const coffeeTree = {
        question: "Coffee or milk based?",
        options: {
            "Coffee Based": { // C
                question: "Traditional or new generation?",
                options: {
                    "Traditional": { // T
                        question: "Hot or iced?",
                        options: {
                            "Hot": "Turkish Coffee", // H -> TR
                            "Iced": "Cold Brew"      // I -> CB
                        }
                    },
                    "New Generation": { // N
                        question: "Sweet or strong?",
                        options: {
                            "Sweet": { // SW
                                question: "What flavor syrup would you like?",
                                options: {
                                    "Chocolate": { // CH
                                        question: "Iced or hot?",
                                        options: {
                                            "Hot": "Hot Caffe Mocha", // H -> HCM
                                            "Iced": { // I
                                                question: "Blended the ice or not?",
                                                options: {
                                                    "Blended": { // B
                                                        question: "Would you like cream on top?",
                                                        options: {
                                                            "Yes, cream on top!": "Mocha Frappe with Chocolate Cream", // COT -> MFC
                                                            "No cream, thanks.": "Mocha Frappe" // NC -> MF
                                                        }
                                                    },
                                                    "Not Blended": "Iced Caffe Mocha" // NB -> ICM
                                                }
                                            }
                                        }
                                    },
                                    "Vanilla": { // V
                                        question: "Iced or hot?",
                                        options: {
                                            "Hot": "Vanilla Bean Cappuccino", // H -> Vb (using full name from mapping)
                                            "Iced": { // I
                                                question: "Blended the ice or not?",
                                                options: {
                                                    "Blended": { // B
                                                        question: "Would you like cream on top?",
                                                        options: {
                                                            "Yes, cream on top!": "Vanilla Frappe with Vanilla Cream", // COT -> Vpc
                                                            "No cream, thanks.": "Vanilla Frappe" // NC -> Vf
                                                        }
                                                    },
                                                    "Not Blended": "Iced Shaken Vanilla Espresso" // NB -> ISV
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "Strong": { // ST
                                question: "Iced or hot?",
                                options: {
                                    "Hot": "Lungo", // H -> L
                                    "Iced": { // I
                                        question: "Blended the ice or not?",
                                        options: {
                                            "Blended": "Coffee Frappe", // B -> CF
                                            "Not Blended": "Iced Cortado" // NB -> IC
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "Milk Based": { // M
                question: "Traditional or new generation?",
                options: {
                    "Traditional": { // T
                        question: "Iced or hot?",
                        options: {
                            "Hot": "Cafe au Lait", // H -> Au
                            "Iced": { // I
                                question: "Blended the ice or not?",
                                options: {
                                    "Blended": { // B
                                        question: "Would you like foam on top?",
                                        options: {
                                            "Yes, with foam!": "Latte Frappe with Cold Foam on Top", // WF -> LFF
                                            "No foam, please.": "Coffee Latte Frappe" // WOF -> CLF
                                        }
                                    },
                                    "Not Blended": "Iced Latte" // NB -> IL
                                }
                            }
                        }
                    },
                    "New Generation": { // N
                        question: "Would you like syrup/sweetener?",
                        options: {
                            "Yes, please! ": { // SY
                                question: "What flavor syrup would you like?",
                                options: {
                                    "Caramel": { // CR
                                        question: "Iced or hot?",
                                        options: {
                                            "Hot": "Caramel Breve", // H -> Cb (caramel)
                                            "Iced": { // I
                                                question: "Blended the ice or not?",
                                                options: {
                                                    "Blended": { // B
                                                        question: "Would you like cream on top?",
                                                        options: {
                                                            "Yes, cream on top!": "Caramel Frappe with Vanilla Cream", // COT -> Cfc
                                                            "No cream, thanks.": "Caramel Frappe" // NC -> Cfr
                                                        }
                                                    },
                                                    "Not Blended": "Caramel Cream Brûlée Latte" // NB -> Cbl
                                                }
                                            }
                                        }
                                    },
                                    "Hazelnut": { // HZL
                                        question: "Iced or hot?",
                                        options: {
                                            "Hot": "Gingerbread Latte", // H -> G
                                            "Iced": { // I
                                                question: "Blended the ice or not?",
                                                options: {
                                                    "Blended": { // B
                                                        question: "Would you like cream on top?",
                                                        options: {
                                                            "Yes, cream on top!": "Hazelnut Frappe with Toffee Cream", // COT -> Hfc
                                                            "No cream, thanks.": "Hazelnut Frappe" // NC -> Hl
                                                        }
                                                    },
                                                    "Not Blended": "Iced Toffee Nut Latte" // NB -> IT
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "No, thanks.": { // NS
                                question: "Iced or hot?",
                                options: {
                                    "Hot": "Cappuccino", // H -> Capp
                                    "Iced": "Iced Flat White" // I -> IFL
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    let currentNode = coffeeTree;

    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        } else {
            console.error("Screen not found:", screenName);
        }
    }

    function displayQuestion(node) {
        questionTextElement.textContent = node.question;
        optionsContainer.innerHTML = ''; // Clear previous options

        for (const optionText in node.options) {
            const button = document.createElement('button');
            button.textContent = optionText;
            button.classList.add('choice-button');
            button.addEventListener('click', () => handleChoice(optionText, node.options[optionText]));
            optionsContainer.appendChild(button);
        }
        showScreen('question');
    }

    function handleChoice(choiceText, nextNode) {
        // Visual feedback
        const clickedButton = Array.from(optionsContainer.children).find(btn => btn.textContent === choiceText);
        if (clickedButton) {
            clickedButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickedButton.style.transform = 'scale(1)';

                if (typeof nextNode === 'string') {
                    // It's a coffee recommendation (leaf node)
                    displayRecommendation(nextNode);
                } else if (typeof nextNode === 'object' && nextNode.question) {
                    // It's another question
                    currentNode = nextNode;
                    displayQuestion(currentNode);
                } else {
                    console.error("Invalid node structure for choice:", choiceText, nextNode);
                    displayRecommendation("Oops! Something went wrong in our recipe book. Try again!");
                }
            }, 150);
        } else {
             if (typeof nextNode === 'string') {
                displayRecommendation(nextNode);
            } else if (typeof nextNode === 'object' && nextNode.question) {
                currentNode = nextNode;
                displayQuestion(currentNode);
            }
        }
    }

    function displayRecommendation(coffeeName) {
        coffeeRecommendationElement.textContent = coffeeName;
        showScreen('results');
    }

    function resetApp() {
        currentNode = coffeeTree;
        showScreen('start');
    }

    startButton.addEventListener('click', () => {
        displayQuestion(coffeeTree);
    });

    restartButton.addEventListener('click', resetApp);

    // Initial setup
    resetApp();
});