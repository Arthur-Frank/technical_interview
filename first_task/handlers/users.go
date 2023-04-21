package handlers

import (
	"encoding/json"
	"errors"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/matscus/technical_interview/first_task/users"
)

var (
	ch     = make(chan users.User, 10000)
	uuids  = make([]users.User, 0, 10000)
	start  = time.Now()
	enable = false
)

func init() {
	for {
		time.Sleep(5 * time.Second)
		if time.Now().Sub(start) < (5 * time.Minute) {
			go reader()
			enable = true
			break
		}
	}
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := users.GetAll()
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
	}
	err = json.NewEncoder(w).Encode(users)
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
	}
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, ok := params["id"]
	if ok {
		uuid, err := uuid.Parse(id)
		if err != nil {
			WriteHTTPError(w, http.StatusOK, errors.New("uuid format is not valide"))
			return
		}
		user, err := users.Get(uuid)
		if err != nil {
			WriteHTTPError(w, http.StatusInternalServerError, err)
			return
		}
		ch <- user
		err = json.NewEncoder(w).Encode(user)
		if err != nil {
			WriteHTTPError(w, http.StatusInternalServerError, err)
			return
		}
		return
	}
	WriteHTTPError(w, http.StatusOK, errors.New("params id not found"))
}

func CreateRandomUser(w http.ResponseWriter, r *http.Request) {
	user := users.New()
	err := user.Create()
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
		return
	}
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
		return
	}
}
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	user := users.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
		return
	}
	if enable {
		ch <- user
	}
	user.Update()
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	user := users.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		WriteHTTPError(w, http.StatusInternalServerError, err)
		return
	}
	if enable {
		ch <- user
	}
	user.Delete()
}

func reader() {
	for {
		u := <-ch
		if (rand.Intn(3 - 1)) == 1 {
			uuids = append(uuids, u)
		}
	}
}
