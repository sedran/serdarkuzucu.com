function skill(title, description, score) {
    return {
        title: title,
        description: description,
        score: score
    };
}

var cv = {
    profile: {
        name: "Serdar",
        surname: "Kuzucu",
        avatar: "/img/me.png",
        title: "Software Engineer"
    },
    
    social: {
        facebook: "https://www.facebook.com/srdrkzc",
        twitter: "https://twitter.com/sedran",
        blog: "http://blog.asosyalbebe.com",
        linkedin: "http://tr.linkedin.com/in/serdarkuzucu",
        google: "https://plus.google.com/+SerdarKUZUCU/posts",
        stackoverflow: "http://stackoverflow.com/users/618279/sedran"
    },
    
    skills: [
        skill("Android", "", 2),
        skill("SQL", "", 4),
        skill("HTML 5", "", 4),
        skill("OOP", "Object Oriented Programming", 5),
        skill("MongoDB", "", 4),
        skill("Chrome Extensions", "", 4),
        skill("C / C++", "", 2),
        skill("MySQL", "", 4),
        skill("Angular JS", "", 5),
        skill("Javascript", "", 5),
        skill("Java SE / EE", "", 5),
        skill("Spring Framework", "", 5),
        skill("Hibernate / JPA", "", 5),
        skill("Oracle DB", "", 3),
        skill("jQuery", "", 5),
        skill("Perl", "", 1),
        skill("Maven", "", 4),
        skill("REST", "", 4),
        skill("Weblogic", "", 3),
        skill("CSS", "", 4),
        skill("PHP", "", 3)
    ]
};