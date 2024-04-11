import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { API_KEY } from "@env";
import { AppLoading } from "expo";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";

const Stack = createNativeStackNavigator();

function PopularMoviesScreen({ navigation }) {
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movies/popular",
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      )
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("Movie", { id: item.id })}
          >
            <Image
              style={styles.movieImage}
              source={{ uri: item.poster_path.original }}
            />
            <View style={styles.text}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text>{item.overview.slice(0, 200)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function MovieScreen({ route, navigation }) {
  const { id } = route.params;
  const [movie, setMovie] = React.useState(null);

  React.useEffect(() => {
    axios
      .get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movie/${id}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      )
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <View style={styles.movieContainer}>
      {movie ? (
        <>
          <Text style={styles.pageTitle}>{movie.title}</Text>
          <Image
            style={styles.moviePoster}
            source={{ uri: movie.poster_path.original }}
          />
          <View style={styles.textPage}>
            <Text>{movie.genre_ids}</Text>
            <Text style={styles.pageOverview}>{movie.overview}</Text>
          </View>
          <View styles={styles.revenir}>
            <TouchableOpacity
              onPress={() => navigation.navigate("PopularMovies")}
              styles={styles.boutton}
            >
              <Text style={styles.backFilms}>Revenir aux Films</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#F1EFF1",
          },

          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="PopularMovies"
          component={PopularMoviesScreen}
          options={{ title: "Popular Movies" }}
        />
        <Stack.Screen
          name="Movie"
          component={MovieScreen}
          options={{ title: "Movie Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1EFF1",
  },
  listItem: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  movieTitle: {
    padding: 10,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
  movieImage: {
    width: 100,
    height: 150,
  },
  text: {
    margin: 10,
    flex: 1,
    fontFamily: "Inter_400Regular",
  },

  movieContainer: {
    flex: 1,
    backgroundColor: "#F1EFF1",
    alignItems: "center",
  },
  moviePoster: {
    width: 100,
    height: 150,
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    fontFamily: "Inter_400Regular",
  },
  pageOverview: {
    fontSize: 18,
    padding: 20,
    fontFamily: "Inter_400Regular",
  },
  stackStyle: {
    backgroundColor: "#868990",
  },
  backFilms: {
    borderRadius: 30,
    backgroundColor: "#2D4D4D",
    width: 300,
    marginTop: 30,
    height: 50,
    padding: 15,
    textAlign: "center",
    borderRadius: 20,
  },
  boutton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 30,
  },
  revenir: {
    borderRadius: 30,
    backgroundColor: "#2D4D4D",
    width: 300,
    marginTop: 30,
    height: 50,
    padding: 15,
    textAlign: "center",
    borderRadius: 30,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
