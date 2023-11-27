package app

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Guest struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	GroupID int    `json:"group_id"`
	UserID  int    `json:"user_id"`
}

func GetGuests(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT * FROM guests")
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		defer rows.Close()

		guests := []Guest{}
		for rows.Next() {
			var guest Guest
			err := rows.Scan(&guest.ID, &guest.Name, &guest.GroupID)
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
				return
			}
			guests = append(guests, guest)
		}
		c.JSON(http.StatusOK, guests)
	}
}

func CreateGuest(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var guest Guest
		if err := c.ShouldBindJSON(&guest); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
			return
		}

		// Check if the group exists
		var ID int
		err := db.QueryRow("SELECT id FROM `groups` WHERE id = ?", guest.GroupID).Scan(&ID)
		log.Println(guest.GroupID)
		log.Println(ID)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Group not found"})
				return
			}
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error, Group Not Found"})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		// Insert the guest into the guests table
		result, err := tx.Exec("INSERT INTO guests (name, group_id, user_id) VALUES (?, ?, ?)", guest.Name, guest.GroupID, guest.UserID)
		if err != nil {
			log.Println(err)
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error, Guest not inserted"})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			log.Println(err)
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		guest.ID = int(id)

		// Update the present count in the groups table
		_, err = tx.Exec("UPDATE `groups` SET present = present + 1 WHERE id = ?", guest.GroupID)
		if err != nil {
			log.Println(err)
			err := tx.Rollback()
			if err != nil {
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error, Group Present Status not updated"})
			return
		}

		if err := tx.Commit(); err != nil {
			log.Println(err)
			err := tx.Rollback()
			if err != nil {
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(http.StatusCreated, guest)
	}
}

func DeleteGuest(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		result, err := db.Exec("DELETE FROM guests WHERE id = ?", id)
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
			c.JSON(http.StatusNotFound, gin.H{"error": "Guest not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Guest deleted"})
	}
}

func GetGuestsByGroupID(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		groupID := c.Param("id")

		rows, err := db.Query("SELECT * FROM guests WHERE group_id = ?", groupID)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		defer rows.Close()

		guests := []Guest{}
		for rows.Next() {
			var guest Guest
			err := rows.Scan(&guest.ID, &guest.Name, &guest.GroupID)
			if err != nil {
				log.Println(err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
				return
			}
			guests = append(guests, guest)
		}
		c.JSON(http.StatusOK, guests)
	}
}