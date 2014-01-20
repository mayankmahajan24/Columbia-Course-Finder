var divstrdata = "";
var count = 0;
var loadedDepts = {};
var selectedCourses = [];
var url = "";
var idToTitle = [];
var unloadedDepts = [];



function setTerm(value)
{
    filtersList["term"] = [value + ""];

}


function addSelected(c) //handles the click events for checkboxes
{
    var call = "";
    if (c.id.indexOf("l_") == -1) // you clicked one of your selected courses and made it false
    {
        call = c.id;
        string = "#l_"+call;

        $(string).prop('checked',false);//set the list one to false
    }
    else //you clicked the list item 
    {   
       call = c.id.substring(2);

    }
    if (c.checked) //now it's true
    {
      if ($.inArray(call, selectedCourses) == -1)
        {
            selectedCourses.push(call)
        }
    }
    else
    {
        selectedCourses.splice($.inArray(call, selectedCourses), 1);
    }


    updateURL();
    updateSelected();
}

function updateURL()
{
    //http://courses.adicu.com/#/schedule?semester=20141&sections=28118,24562&28118.color=green&24562.color=gray
    url = "http://courses.adicu.com/#/schedule?";
    url = url + "semester=" + filtersList["term"];
    url = url + "&sections=";

    $.each(selectedCourses, function()
    {
        url = url + this + ",";
    });
    

    $("#adical").html("<iframe src='" + url + "' height='800px' width='1200px'></iframe>");
}

function updateSelected()
{
    var selstring = "";
    $.each(selectedCourses, function()
    {
        selstring = selstring + "<div class='checkbox'><label><input id = '" + section.CallNumber + "' type='checkbox' onclick = 'addSelected(this);' style='width:18px; height:18px;' checked>" + idToTitle[this] + "</label></div>"; 
    });
    $("#selCourses").html(selstring);
}


function isValid(filtersList, course, section)
{

    var input = $("#coursename").val().toUpperCase();
    if (section.StartTime1 == "None")
        return false;
        
    if (filtersList["term"].length != 0 &&  $.inArray(section.Term, filtersList["term"]) == -1 && $.inArray("All", filtersList["term"]) == -1)
        return false;
        
    if (filtersList["dept"].length != 0 && $.inArray(course.DepartmentCode, filtersList["dept"]) == -1 && $.inArray("All", filtersList["dept"]) == -1)
        return false;
        
    if (filtersList["starttime"].length != 0 && section.StartTime1 != "None" && $.inArray(section.StartTime1.split(":")[0], filtersList["starttime"]) == -1 && $.inArray("All", filtersList["starttime"]) == -1)
        return false;
        
    if (filtersList["endtime"].length != 0 && section.EndTime1 != "None" && $.inArray(section.EndTime1.split(":")[0], filtersList["endtime"]) == -1 && $.inArray("All", filtersList["endtime"]) ==-1)
        return false;
            
    altname = course.CourseFull.substring(0,4) + course.CourseFull.substring(5);
    
    if (input != "" && course.CourseFull.indexOf(input) == -1 && altname.indexOf(input) == -1 && course.CourseTitle.indexOf(input) == -1 && section.Instructor1Name.indexOf(input) == -1)
        return false;
    return true;
}


function buildTablesorter(course, section)
{
   
   
    idToTitle[section.CallNumber] = course.CourseTitle;
    var o = count % 2 == 0 ? "even" : "odd";
    divstrdata +="<tr class='" + o +"'>";
    divstrdata +="<td><div class='checkbox'><label><input id = l_" + section.CallNumber + " type='checkbox' onclick = 'addSelected(this);' style='width:18px; height:18px;'></label></div></td>";
    divstrdata +="<td>" + section.CallNumber + "</td>";
    divstrdata +="<td>" + course.CourseFull.substring(0,4)+" " + course.CourseFull.substring(4) + "</td>";
    divstrdata +="<td><abbr title='" + (course.Description == null ? "N/A'>" : (course.Description.substring(0,121) + "...'>")) + course.CourseTitle + "</abbr></td>";
    divstrdata +="<td>" + course.NumFixedUnits/10.0 + "</td>";
    divstrdata +="<td>" + (section.Instructor1Name != "" ? section.Instructor1Name: "N/A") + "</td>";
    divstrdata +="<td>" + (section.MeetsOn1 != null ? section.MeetsOn1: "N/A") + "</td>";
    divstrdata +="<td>" + (section.StartTime1 != "None" ? section.StartTime1: "N/A") + "</td>";
    divstrdata +="<td>" + (section.EndTime1 != "None" ? section.EndTime1: "N/A") + "</td>";
    divstrdata +="<td>" + "<a href='http://www.columbia.edu/cu/bulletin/uwb/subj/" + course.CourseFull.substring(0,4) + '/' + (course.CourseFull.substring(4,5) != "X" ? course.CourseFull.substring(4) : "BC" + course.CourseFull.substring(5))+ '-' + section.Term + '-' + section.SectionFull.substring(section.SectionFull.length-3) + '/' + "' target='_blank'>Link</a></td>";
    divstrdata += "</tr>";
}




function processJSON(json)
{
    var course = "";
    if (json.data == null)
    {
        $('#tableresults tbody').html(divstrdata);
        return;
    }
    $.each(json.data, function()
    {
     course = this;
    $.each(course.Sections, function()
        {
            section = this;
            if (isValid(filtersList, course, section))
            {
               count++;
               buildTablesorter(course, section);
           }
        });
    });
                //$("#results").html(divstrdata);
                $('#tableresults tbody').html(divstrdata);
                $('#tableresults').tablesorter(); 
                 $('#tableresults').trigger("update");
               
                 $("#count").html("<p><b>Total Number of Results: " + count + "</b></p>");
                
                
}

//onclick 
$(function(){

    $('.btn-group button').on('click',function()//switching terms
    {
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');
   
    });

    //when the user clicks submit
    $('#submit').on('click', function(e){

    var results = document.getElementById('results');
    divstrdata = "";
    count = 0;
    processedDepts = [];
    divstrdata = "";
    unloadedDepts = [];

    if (filtersList["dept"].length!= 0)
    {
       
        var list = $.inArray("All", filtersList["dept"]) == -1 ? filtersList["dept"]: deptList;

        $.each (list, function(){
            var deptcode = this; 



            if (loadedDepts[deptcode] != null)
            {  
                processJSON(loadedDepts[deptcode]);
                processedDepts.push(deptcode);
            }
            
           else
           {
                $('#loading').show();  
                $.ajax({
               type: 'GET',
               url: "http://data.adicu.com/courses/v2/courses?api_token=021ebbe6765f11e394bf12313d000d18&department="+deptcode+"&pretty=true&limit=10000",
               dataType: 'jsonp', 
               success: function(json)
               {
                    loadedDepts[deptcode] = json;
                    processJSON(json);
                    processedDepts.push(deptcode);
                    if (processedDepts.length == list.length)
                    {
                        $("#loading").hide();
                        $("#count").html("<p><b>Total Number of Results: " + count + "</b></p>");


                    }

                },
               error: function() { 
                unloadedDepts.push(deptcode);
                $("#loading").hide();
                 $("#count").html("<p><b>Total Number of Results: " + count + "</b></p>");
                 $("#error").html("<font color='red'>Could not load the following departments: " + unloadedDepts + "</font>");

                 },
               jsonp: 'jsonp'
              
                });
            }
            
            if (processedDepts.length == list.length)
            {
                        $("#loading").hide();
                         $("#count").html("<p><b>Total Number of Results: " + count + "</b></p>");

            }
        });
    }
    else {alert("You must select a department(s). You can pick 'All.'");}
    });
});