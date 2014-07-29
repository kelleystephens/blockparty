Block Party
=============

Sometimes the first introduction is the hardest!
Use Block Party to meet your neighbors virtually!
Then, keep up with important neighborhood info, events and changes!




For updated passport redirect for successful login go into:
node modules -> passport -> lib -> passport -> middleware -> authenticate.js

On line 215, change if statement to:

    if (options.successRedirect) {
      if(req.user && req.user.coordinates){
        return res.redirect('/dashboard');
      }else{
        return res.redirect('/profile');
      }
    }
