import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';



const questions = [
  {
    question: "Qual é o nome do protagonista da série Zelda?",
    options: [
      "Link",
      "Zelda",
      "Epona",
      "Navi"
    ],
    answer: "Link"
  },
  {
    question: "Qual é o genero do jogo Zelda?",
    options: ["Aventura", "RPG", "Ação", "Estratégia"],
    answer: "Aventura"
  },
  {
    question: "Qual é o nome da raça à qual Link pertence?",
    options: ["Hylian", "Gorons", "Zoras", "Gerudo"],
    answer: "Hylian"
  },
  {
    question: "Qual é o nome do cavalo que Link monta em muitos jogos da série Zelda?",
    options: ["Epona", "Navi", "Tatl", "Tael"],
    answer: "Epona"
  },
  {
    question: "Qual é o nome do item que Link usa para se teleportar para diferentes locais?",
    options: ["Portal", "Boomerang", "Ocarina of Time", "Master Sword"],
    answer: "Ocarina of Time"
  },
  {
    question: "Qual é o nome do vilão principal da série Zelda?",
    options: ["Ganondorf", "Zant", "Dark Link", "Ganon"],
    answer:'Ganondorf'
  },
  {
    question: "Qual é o nome do reino onde a maioria dos jogos da série Zelda se passa?",
    options: ["Hyrule", "Termina", "Koholint", "Holodrum"],
    answer: "Hyrule"
  },
  {
    question: "Qual é o nome do jogo da série Zelda que se passa no mundo de Lorule?",
    options: ["The Legend of Zelda: A Link Between Worlds", "The Legend of Zelda: Ocarina of Time", "The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Twilight Princess"],
    answer: "The Legend of Zelda: A Link Between Worlds"
  },
  {
    question: "Qual é o nome do item que Link usa para nadar?",
    options: ["Botas de Zora", "Escudo", "Bomba", "Gancho"],
    answer: "Botas de Zora"
  },
  {
    question: "Qual é o nome do item que Link usa para voar em alguns jogos da serie Zelda?",
    options: ["Paraglider", "Asa de Pássaro", "Asa de Dragão", "Asa de Morcego"],
    answer: "Paraglider"
  },
];

const QuizCard = () => {

  // Estados para controlar o quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questions>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false); // NOVO estado para saber se o quiz acabou

  const shuffleArray = <T,>(array: T[]): T[] => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    const shuffled = shuffleArray(questions);
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (shuffledQuestions.length > 0 && !quizFinished) {
      setShuffledOptions(shuffleArray(shuffledQuestions[currentQuestion].options));
    }
  }, [currentQuestion, shuffledQuestions, quizFinished]);

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);

    if (option === shuffledQuestions[currentQuestion].answer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizFinished(true); // Mostra a tela de resultado
      }
    }, 1000);
  };

  const handleRestartQuiz = () => {
    const reshuffled = shuffleArray(questions);
    setShuffledQuestions(reshuffled);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setQuizFinished(false);
  };

  if (shuffledQuestions.length === 0) return null;

  if (quizFinished) {
    // Tela de Resultado
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Resultado do Quiz</Text>
        <View style={styles.card}>
          <Text style={styles.resultText}>Acertos: {correctAnswers}</Text>
          <Text style={styles.resultText}>Erros: {wrongAnswers}</Text>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestartQuiz}>
            <Text style={styles.restartButtonText}>Recomeçar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      <View style={styles.card}>
        <Text style={styles.question}>{question.question}</Text>
        {shuffledOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && {
                backgroundColor:
                  option === question.answer ? "#4CAF50" : "#F44336"
              }
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={!!selectedOption}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.passButton}>
          <Text style={styles.passText}>PASS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    width: '85%',
    elevation: 5
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },
  optionButton: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16
  },
  passButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginTop: 15
  },
  passText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  
  restartButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default QuizCard;