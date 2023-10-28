fetch('https://api.jsonbin.io/v3/b/65313b1f54105e766fc45c50')
  .then((response) => response.json())
  .then((json) => {

    fetch('https://api.jsonbin.io/v3/b/65313b7554105e766fc45c72')
      .then((response) => response.json())
      .then((users) => {

        fetch('https://api.jsonbin.io/v3/b/65313b5454105e766fc45c63')
          .then((response) => response.json())
          .then((exams) => {

            var urlParam = new URLSearchParams(window.location.search)
            var paramUser = urlParam.get('name')
            var user = users.record[`@${paramUser}`]

            document.querySelector(`title`).textContent = user.name + " | " + "Órarend"
            document.querySelector(`span.profileName`).textContent = user.name

            var days = Object.keys(json.record)
            var examDays = Object.keys(exams.record)

            days.forEach((day) => {
              for (let x = 1; x <= 5; x++) {
                let z = String.fromCharCode(96 + x)
                for (let y = 1; y <= 7; y++) {
                  var id = z + y
                  if (json.record[day][id]) {

                    examDays.forEach(examDay => {
                      function getMonday(d) {
                        d = new Date(d);
                        var day = x,
                          diff = d.getDate() - day + (day == 0 ? -6 : 1);
                        return new Date(d.setDate(diff));
                      }

                      var examDate = getMonday(new Date()).toDateString()

                      if (examDay === examDate) {

                        var p = String.fromCharCode(96 + getMonday(new Date()).getDay())

                        const examData = exams.record[examDay][y]
                        if (examData) {
                          var examClass = `${p}${y}`
                          var examSubject = examData.subject
                          examIcon(examClass, examSubject)
                        }
                        
                        function examIcon(examClass, examSubject) {
                        if (examClass && examSubject) {
                          if (json.record[day][id].subjects[examSubject]) {
                            console.log(examClass + "/" + examSubject)

                            let cell = document.querySelector(`div#${examClass}`)
                            let button = cell.parentElement
                            button.style.cursor = "pointer"

                            const link = document.createElement('a');
                            link.className = 'examLink'
                            link.href = examData.link
                            link.target = "_blank"

                            const image = document.createElement('img');
                            image.className = 'image';
                            image.src = "../assets/icon.png"

                            const hover = document.createElement('img');
                            hover.className = 'hover';
                            hover.src = "../assets/icon-hover.png"

                            cell.appendChild(image)
                            cell.appendChild(hover)
                            button.appendChild(link)
                          }
                        }
                      }
                      }
                    })

                    if (json.record[day][id].subjects.multiple) {
                      var a = "type" + json.record[day][id].subjects.type
                      var i = user[a]
                      fill(i)
                    } else {
                      var i = 1
                      fill(i)
                    }

                    function fill(i) {
                      let cell = document.querySelector(`div#${id}`)

                      const teacher = document.createElement('span');
                      teacher.className = 'teacher';
                      if (i < 1) { teacher.textContent = "" } else { teacher.textContent = json.record[day][id].subjects[i].monogram.toString(); }

                      const subject = document.createElement('span');
                      subject.className = 'subject';
                      if (i < 1) { subject.textContent = "" } else { subject.textContent = json.record[day][id].subjects[i].subject.toString(); }

                      const classroom = document.createElement('span');
                      classroom.className = 'classroom';
                      if (i < 1) { classroom.textContent = "" } else { classroom.textContent = json.record[day][id].subjects[i].room.toString(); }

                      cell.appendChild(teacher)
                      cell.appendChild(subject)
                      cell.appendChild(classroom)
                    }
                  }
                }
              }
            })
          })
      })
  })