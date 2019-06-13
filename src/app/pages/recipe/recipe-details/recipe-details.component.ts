import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../../services/recipe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit() {
    const recipeId = +this.route.snapshot.paramMap.get('id');
    if ( recipeId && this.recipeService.selectedRecipe.RecipeId === recipeId) {
      this.recipe = this.recipeService.selectedRecipe;
    }
  }

}
