// modulos importados
var gulp = require('gulp')
    ,imagemin = require('gulp-imagemin')          // deixa as imagens mais leve
    ,clean = require('gulp-clean')                // limpa a pasta dist
    ,concat = require('gulp-concat')              // junta os arquivos em um unico
    ,htmlReplace = require('gulp-html-replace')   // troca os textos dentro do html
    ,uglify = require('gulp-uglify')              // diminui o tamanhos das variaveis e deixa o codigo inline
    ,usemin = require('gulp-usemin')              // troca as referencias dentro do html
    ,cssmin = require('gulp-cssmin')              // minifica o tamanho do css
    ,browserSync = require('browser-sync')        // deixa os arquivos da pasta src sincronizado com o browser 
    ,jshint = require('gulp-jshint')              // verifica e mostra erros no JavaScript
    ,jshintStylish = require('jshint-stylish')    // melhora a visualização dos erros JavaScript
    ,csslint = require('gulp-csslint')            // verifica e mostra erros no css
    ,autoprefixer = require('gulp-autoprefixer'); // cria prefixos css para compaibilidade em todos os navegadores

// starta todo o processo
gulp.task('default', ['copy'],function(){
    gulp.start('build-img','usemin')    
});

//deleta a pasta dist
gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());   
});

// Cria a pasta dist
gulp.task('copy', ['clean'], function(){
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

// reduzir tamanho das imagens
gulp.task('build-img', function(){
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// concatena todos os arquivos JavaScript e css, 
// altera as referencias no html,
// minifica
// insere os prefixos no css para todos os navegadores
gulp.task('usemin', function() {
  return gulp.src('dist/**/*.html')
    .pipe(usemin({
      js: [uglify],
      css: [autoprefixer, cssmin]
    }))
    .pipe(gulp.dest('dist'));
});

//monta um servidor na porta 3000 e sincorniza o browser com o codigo
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
    gulp.watch('src/**/*').on('change', browserSync.reload);

    // Verifica erros no javascript
    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish));
    }); 

    // Verifica erros no CSS
    gulp.watch('src/css/**/*.css').on('change',function(event){
        console.log("Linting"+event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());
    });
}); 