package app

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FetchEventWithGuests(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("fetchEventWithGuests")
		fmt.Println(c.Query("id"))
		var group Group
		eventId := c.Query("id")
		err := db.QueryRow("SELECT id, name, time, event_time, event_date, event_period, leader FROM `groups` WHERE id = ?", eventId).Scan(&group.ID, &group.Name, &group.Time, &group.EventTime, &group.EventDate, &group.EventPeriod, &group.Leader)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error-1"})
			}
			return
		}

		guests := make([]Guest, 0)
		rows, err := db.Query("SELECT id, name, group_id, user_id FROM guests WHERE group_id = ?", eventId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error-2"})
			return
		}
		defer rows.Close()
		for rows.Next() {
			var guest Guest
			if err := rows.Scan(&guest.ID, &guest.Name, &guest.GroupID, &guest.UserID); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error-3"})
				return
			}
			guests = append(guests, guest)
		}
		c.JSON(http.StatusOK, gin.H{"event": group, "guests": guests})
	}
}

func LeaveEvent(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			GroupID int `json:"group_id"`
			UserID  int `json:"user_id"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Check if the Guest exists in the group
		var guestID int
		err := db.QueryRow("SELECT id FROM guests WHERE group_id = ? AND user_id = ?", req.GroupID, req.UserID).Scan(&guestID)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "guest not found in group"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error-1"})
			}
			return
		}

		// Remove the Guest from the group
		_, err = db.Exec("DELETE FROM guests WHERE id = ?", guestID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error-2"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Guest left the group"})
	}
}
