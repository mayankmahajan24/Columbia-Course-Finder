var divstrdata = "";
var count = 0;
var loadedDepts = {};


function setTerm(value)
{
    filtersList["term"] = [value];

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
    if (input != "" && course.CourseFull.indexOf(input) == -1 && altname.indexOf(input) == -1 && course.CourseTitle.indexOf(input) == -1)
        return false; 
    //else if doesnt match search title criteria o
    return true;
}

function buildBootstrap(course, section)
{
    
    divstrdata +="<div class='row show-grid'>";
    divstrdata +="<div class='col-sm-2'>" + section.CallNumber + "</div>";
    divstrdata +="<div class='col-sm-2'>" + course.CourseFull + "</div>";
    divstrdata +="<div class='col-sm-2'>" + course.CourseTitle + "</div>";
    divstrdata +="<div class='clearfix visible-xs'></div>";
    divstrdata +="<div class='col-sm-1'>" + course.NumFixedUnits/10.0 + "</div>";
    divstrdata +="<div class='col-sm-2'>" + (section.Instructor1Name != "" ? section.Instructor1Name: "N/A") + "</div>";
    divstrdata +="<div class='col-sm-1'>" + (section.MeetsOn1 != null ? section.MeetsOn1: "N/A") + "</div>";
    divstrdata +="<div class='col-sm-1'>" + (section.StartTime1 != "None" ? section.StartTime1: "N/A") + "</div>";
    divstrdata +="<div class='col-sm-1'>" + (section.EndTime1 != "None" ? section.EndTime1: "N/A") + "</div>";
    divstrdata += "</div>";
}

function buildTablesorter(course, section)
{
    var o = count % 2 == 0 ? "even" : "odd";
    divstrdata +="<tr class='" + o +"'>";
    divstrdata +="<td>" + section.CallNumber + "</td>";
    divstrdata +="<td>" + course.CourseFull.substring(0,4)+" " + course.CourseFull.substring(4) + "</td>";
    divstrdata +="<td>" + course.CourseTitle + "</td>";
    divstrdata +="<td>" + course.NumFixedUnits/10.0 + "</td>";
    divstrdata +="<td>" + (section.Instructor1Name != "" ? section.Instructor1Name: "N/A") + "</td>";
    divstrdata +="<td>" + (section.MeetsOn1 != null ? section.MeetsOn1: "N/A") + "</td>";
    divstrdata +="<td>" + (section.StartTime1 != "None" ? section.StartTime1: "N/A") + "</td>";
    divstrdata +="<td>" + (section.EndTime1 != "None" ? section.EndTime1: "N/A") + "</td>";
    divstrdata += "</tr>";
}

function processJSON(json)
{
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

                $("#count").html("<p><b>Total Number of Results:" + count + "</b></p>");
                count = 0;
                $("#loading").hide();
}

//onclick
$(function(){

    $('.btn-group button').on('click',function()
{
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');
   
});






    //alert("you in this!");
    $('#submit').on('click', function(e){
//alert("clicked!");
//location.reload();


var results = document.getElementById('results');
divstrdata = "";

//document.write("<p><b>" + JSON.stringify(filtersList)+"</b></p>");

if (filtersList["dept"].length!= 0)
{
    $('#loading').show();  
    var list = $.inArray("All", filtersList["dept"]) == -1 ? filtersList["dept"]: deptList;

    $.each (list, function(){
        var deptcode = this; 
        if (loadedDepts[deptcode] != null)
        {
            processJSON(loadedDepts[deptcode]);
        }
        
       else
       {
            $.ajax({
           type: 'GET',
           url: "http://data.adicu.com/courses/v2/courses?api_token=021ebbe6765f11e394bf12313d000d18&department="+deptcode+"&pretty=true&limit=10000",
           dataType: 'jsonp', 
           success: function(json)
           {
            loadedDepts[deptcode] = json;
                if (json.status_code == "200")
                {               
                   processJSON(json);
                }
            //console.log("appended" + deptcode);
            },
           error: function() { console.log('Uh Oh!'); },
           jsonp: 'jsonp'
          
            });
        }
    });
}


});
});