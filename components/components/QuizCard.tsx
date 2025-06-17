import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ImageBackground } from 'react-native';

const BackgroundImage = require("../../assets/Zelda.png");
const EstacioLogo = require("../../assets/logo.png");
const questions = [
  {
    question: "Qual é o nome do protagonista da série Zelda?",
    options: ["Link", "Zelda", "Epona", "Navi"],
    answer: "Link"
  },
  {
    question: "Qual é o gênero do jogo Zelda?",
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
    answer: "Ganondorf"
  },
  {
    question: "Qual é o nome do reino onde a maioria dos jogos da série Zelda se passa?",
    options: ["Hyrule", "Termina", "Koholint", "Holodrum"],
    answer: "Hyrule"
  },
  {
    question: "Qual é o nome do jogo da série Zelda que se passa no mundo de Lorule?",
    options: [
      "The Legend of Zelda: A Link Between Worlds",
      "The Legend of Zelda: Ocarina of Time",
      "The Legend of Zelda: The Wind Waker",
      "The Legend of Zelda: Twilight Princess"
    ],
    answer: "The Legend of Zelda: A Link Between Worlds"
  },
  {
    question: "Qual é o nome do item que Link usa para nadar?",
    options: ["Botas de Zora", "Escudo", "Bomba", "Gancho"],
    answer: "Botas de Zora"
  },
  {
    question: "Qual é o nome do item que Link usa para voar em alguns jogos da série Zelda?",
    options: ["Paraglider", "Asa de Pássaro", "Asa de Dragão", "Asa de Morcego"],
    answer: "Paraglider"
  }
];

const QuizCard = () => {
  const [screen, setScreen] = useState<"menu" | "quiz" | "credits">("menu");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questions>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  const shuffleArray = <T,>(array: T[]): T[] =>
    array.map((value) => ({ value, sort: Math.random() }))
         .sort((a, b) => a.sort - b.sort)
         .map(({ value }) => value);

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
        Animated.timing(progressAnim, {
          toValue: ((currentQuestion + 1) / shuffledQuestions.length) * 100,
          duration: 400,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 400,
          useNativeDriver: false,
        }).start();
        setQuizFinished(true);
      }
    }, 1000);
  };

  const handlePass = () => {
    if (selectedOption) return;
    setSkippedQuestions((prev) => prev + 1);
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      Animated.timing(progressAnim, {
        toValue: ((currentQuestion + 1) / shuffledQuestions.length) * 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 400,
        useNativeDriver: false,
      }).start();
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    const reshuffled = shuffleArray(questions);
    setShuffledQuestions(reshuffled);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setSkippedQuestions(0);
    setQuizFinished(false);
    setScreen("menu");
    progressAnim.setValue(0);
  };

  if (screen === "menu") {
    return (
      <ImageBackground source={BackgroundImage} style={styles.background} imageStyle={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Bem-vindo ao Quiz Zelda!</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("quiz")}>
            <Text style={styles.menuButtonText}>Jogar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("credits")}>
            <Text style={styles.menuButtonText}>Créditos</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  if (screen === "credits") {
    return (
      <View style={styles.container}>
        <Image source={EstacioLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.creditTitle}>Campus R9 - Taquara</Text>
        <Text style={styles.creditText}>Desenvolvido por:</Text>
        <Text style={styles.creditText}>João Gabriel Lima Cochet Agra 202502337795</Text>
        <Text style={styles.creditText}>Jorge Lopes da Rocha Neto 202502196385</Text>
        <Text style={styles.creditText}>Inspiração: Série Zelda</Text>
        <Text style={styles.creditText}>Professor: Antônio Candido</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setScreen("menu")}>
          <Text style={styles.menuButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Resultado do Quiz</Text>
        <View style={styles.card}>
          <Text style={styles.resultText}>Acertos: {correctAnswers}</Text>
          <Text style={styles.resultText}>Erros: {wrongAnswers}</Text>
          <Text style={styles.resultText}>Skip: {skippedQuestions}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestartQuiz}>
            <Text style={styles.restartButtonText}>Voltar ao Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (shuffledQuestions.length === 0) return null;

  const question = shuffledQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.question}>{question.question}</Text>
        {shuffledOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption &&
              (option === question.answer
                ? { backgroundColor: "#4CAF50" }
                : selectedOption === option
                ? { backgroundColor: "#F44336" }
                : null),
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={!!selectedOption}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passText}>SKIP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    width: '85%',
    elevation: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
  passButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  passText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
  menuButton: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  creditText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  progressBarContainer: {
    width: '85%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  creditTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default QuizCard;
