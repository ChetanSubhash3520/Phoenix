package app

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Group struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Time        string `json:"Time"`
	EventDate   string `json:"eventDate"`
	EventTime   string `json:"eventTime"`
	EventPeriod string `json:"eventPeriod"`
	Leader      int    `json:"Leader"`
	Min         int    `json:"min"`
	Max         int    `json:"max"`
	Present     int    `json:"present"`
	Place       string `json:"place"`
}

func CreateGroup(db *sql.DB) gin.HandlerFunc {
	
	return func(c *gin.Context) {
		var group Group
		if err := c.ShouldBindJSON(&group); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
			return
		}

		result, err := db.Exec("INSERT INTO `groups` (name, event_date, event_time, event_period, Leader, min, max, present, place) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", group.Name, group.EventDate, group.EventTime, group.EventPeriod, group.Leader, group.Min, group.Max, group.Present, group.Place)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		group.ID = int(id)

		var leaderName string
		err = db.QueryRow("SELECT name FROM users WHERE id = ?", group.Leader).Scan(&leaderName)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		_, err = db.Exec("INSERT INTO guests (name, group_id, user_id) VALUES (?, ?, ?)", leaderName, group.ID, group.Leader)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error for inserting guests"})
		}

		c.JSON(http.StatusCreated, group)
	}
}
func GetGroups(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT * FROM `groups`")
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		defer rows.Close()

		groups := []Group{}
		for rows.Next() {
			var group Group
			err := rows.Scan(&group.ID, &group.Name, &group.Time, &group.Leader, &group.EventTime, &group.EventDate, &group.EventPeriod, &group.Max, &group.Min, &group.Present, &group.Place)
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
				return
			}
			groups = append(groups, group)
		}
		c.JSON(http.StatusOK, groups)
	}
}

func GetGroupsByUser(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var groups []int

		userID := c.Query("user_id")

		rows, err := db.Query("SELECT group_id FROM guests WHERE user_id = ?", userID)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		defer rows.Close()

		for rows.Next() {
			var groupID int
			err := rows.Scan(&groupID)
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
				return
			}

			groups = append(groups, groupID)
		}

		if err := rows.Err(); err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"groups": groups})
	}
}

func UpdateGroup(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var group Group
		if err := c.ShouldBindJSON(&group); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
			return
		}

		result, err := db.Exec("UPDATE `groups` SET name = ? WHERE id = ?", group.Name, id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
			return
		}

		c.JSON(http.StatusOK, group)
	}
}

func DeleteGroup(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		result, err := db.Exec("DELETE FROM `groups` WHERE id = ?", id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Group deleted"})
	}
}