package main

import (
	app "SPL-Spring2023/Backend/app"
	"database/sql"
	_ "fmt"
	"log"
	_ "strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
	// Connect to the database
	var err error
	// root:password
	db, err = sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/test")

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialize the Gin router
	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // replace with your frontend URL
	r.Use(cors.New(config))

	// Define the routes
	r.GET("/groups", app.GetGroups(db))
	r.POST("/groups", app.CreateGroup(db))
	r.DELETE("/groups/:id", app.DeleteGroup(db))
	r.PUT("/groups/:id", app.UpdateGroup(db))

	//r.GET("search/:name", searchGroup)
	r.GET("/guests", app.GetGuests(db))
	r.POST("/guests", app.CreateGuest(db))
	r.DELETE("/guests/:id", app.DeleteGuest(db))
	r.GET("getGuests/:id", app.GetGuestsByGroupID(db))

	r.POST("/register", app.RegisterUser(db))
	r.POST("/check", app.CheckUser(db))
	r.GET("/getUserInfo", app.GetUserInfo(db))
	r.GET("/getGroupsByUser", app.GetGroupsByUser(db))
	r.GET("/fetchEventWithGuests", app.FetchEventWithGuests(db))
	r.POST("/leave-event", app.LeaveEvent(db))
	// Start the server
	r.Run(":8080")
}
